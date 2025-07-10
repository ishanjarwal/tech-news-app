'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Bold,
  Code,
  Heading,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react';

import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Popover } from '../ui/popover';
import './MarkdownEditorStyles.css';
import { Markdown } from 'tiptap-markdown';
import { cn } from '@/lib/utils';

const MenuBar = ({ editor }: { editor: Editor }) => {
  const addImage = (src: string) => {
    if (src) {
      editor.chain().focus().setImage({ src }).run();
    }
  };

  const addLink = (url: string) => {
    if (!url) return;

    const { state } = editor;
    const { from, to, empty } = state.selection;

    editor.chain().focus();

    if (empty) {
      editor
        .chain()
        .insertContent({
          type: 'text',
          text: url,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run();
    } else {
      editor.chain().toggleLink({ href: url }).run();
    }
  };

  return (
    <div className="border-muted mb-4 flex flex-wrap gap-2 rounded-md border p-2">
      <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
        <ToggleGroupItem
          value="paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          data-state={editor.isActive('paragraph') ? 'on' : 'off'}
          aria-label="Paragraph"
        >
          <p className="text-sm">P</p>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="heading1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
          aria-label="H1"
        >
          <span className="flex">
            <Heading />
            <span className="text-xs">1</span>
          </span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="heading2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
          aria-label="H2"
        >
          <span className="flex">
            <Heading />
            <span className="text-xs">2</span>
          </span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="heading3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}
          aria-label="H3"
        >
          <span className="flex">
            <Heading />
            <span className="text-xs">3</span>
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
        <ToggleGroupItem
          value="bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-state={editor.isActive('bold') ? 'on' : 'off'}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-state={editor.isActive('italic') ? 'on' : 'off'}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          data-state={editor.isActive('underline') ? 'on' : 'off'}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-state={editor.isActive('strike') ? 'on' : 'off'}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
        <ToggleGroupItem
          value="blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-state={editor.isActive('blockquote') ? 'on' : 'off'}
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="codeBlock"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          data-state={editor.isActive('codeBlock') ? 'on' : 'off'}
          aria-label="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
        <ToggleGroupItem
          value="bulletList"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-state={editor.isActive('bulletList') ? 'on' : 'off'}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="orderedList"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-state={editor.isActive('orderedList') ? 'on' : 'off'}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex flex-wrap gap-1 overflow-hidden rounded-lg">
        <AddLink onClick={addLink} />
        <AddImage onClick={addImage} />
      </div>

      <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
        <ToggleGroupItem
          value="undo"
          onClick={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="redo"
          onClick={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const MarkdownEditor = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (...props: any[]) => void;
  error?: string;
}) => {
  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    extensions: [
      Markdown,
      StarterKit.configure({}),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
  });

  return (
    <div>
      {editor && <MenuBar editor={editor} />}
      <div
        className={cn(
          'rounded-md p-3',
          error ? 'border-destructive border' : 'border-border border'
        )}
      >
        {error && <p className="text-destructive text-xs">{error}</p>}
        <EditorContent
          editor={editor}
          className="mdeditor max-w-none border-none outline-none focus-within:border-none"
        />
      </div>
    </div>
  );
};

const AddLink = ({ onClick }: { onClick: (value: string) => void }) => {
  const [link, setLink] = useState<string>('');
  const handleClick = () => {
    onClick(link);
  };
  return (
    <Popover>
      <PopoverTrigger className="hover:bg-accent cursor-pointer px-2">
        <Link2 className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="bg-background border-border z-[1] w-[350px] rounded-lg border p-2">
        <div className="flex items-center space-x-1">
          <Input
            className="focus-visible:ring-0"
            onChange={(e) => setLink(e.target.value)}
          />
          <Button type="button" onClick={handleClick}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AddImage = ({ onClick }: { onClick: (value: string) => void }) => {
  const [link, setLink] = useState<string>('');
  const handleClick = () => {
    onClick(link);
  };
  return (
    <Popover>
      <PopoverTrigger className="hover:bg-accent cursor-pointer px-2">
        <ImageIcon className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="bg-background border-border z-[1] w-[350px] rounded-lg border p-2">
        <div className="flex items-center space-x-1">
          <Input
            className="focus-visible:ring-0"
            onChange={(e) => setLink(e.target.value)}
          />
          <Button type="button" onClick={handleClick}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MarkdownEditor;
