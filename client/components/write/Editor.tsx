'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Editor as EditorValues,
  EditorContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Bold,
  Camera,
  Code,
  Columns2,
  Grid3X3,
  Heading,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader,
  Quote,
  Redo,
  Rows2,
  Strikethrough,
  Trash,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Popover } from '../ui/popover';
import './EditorStyles.css';
import Tooltip from '../common/Tooltip';
import { Label } from '../ui/label';
import fireToast from '@/utils/fireToast';
import { FileRejection, useDropzone } from 'react-dropzone';
import NextImage from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { selectPostState, uploadContentImage } from '@/reducers/postReducer';
import { AppDispatch } from '@/stores/appstore';

const MenuBar = ({ editor }: { editor: EditorValues }) => {
  const addImage = (src: string) => {
    editor.chain().focus().setImage({ src }).run();
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
    <div className="flex flex-wrap gap-2 p-2">
      <ToggleGroup type="multiple" className="flex flex-wrap border">
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
      <ToggleGroup type="multiple" className="flex flex-wrap border">
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
      <ToggleGroup type="multiple" className="flex flex-wrap border">
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
      <ToggleGroup type="multiple" className="flex flex-wrap border">
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
      <div className="flex flex-wrap overflow-hidden rounded-lg border">
        <AddLink onClick={addLink} />
        <AddImage onClick={addImage} />
      </div>

      {/* Table */}
      <div className="flex flex-wrap overflow-hidden rounded-lg border">
        <Tooltip content="Insert a table">
          <Button
            type="button"
            className="cursor-pointer !px-2"
            variant={'ghost'}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <Grid3X3 />
          </Button>
        </Tooltip>

        <Tooltip content="Add a row">
          <Button
            type="button"
            variant={'ghost'}
            className="cursor-pointer rounded-none !px-2"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <span className="flex items-center text-xs">
              +<Rows2 />
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Delete this row">
          <Button
            type="button"
            variant={'ghost'}
            className="cursor-pointer rounded-none !px-2"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <span className="flex items-center text-xs">
              −<Rows2 />
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Add a column">
          <Button
            type="button"
            variant={'ghost'}
            className="cursor-pointer rounded-none !px-2"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <span className="flex items-center text-xs">
              +<Columns2 />
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Delete this column">
          <Button
            type="button"
            variant={'ghost'}
            className="cursor-pointer rounded-none !px-2"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <span className="flex items-center text-xs">
              −<Columns2 />
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Delete this Table">
          <Button
            type="button"
            variant={'ghost'}
            className="cursor-pointer rounded-none !px-2"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <span className="text-xs">
              <Trash />
            </span>
          </Button>
        </Tooltip>
      </div>

      <ToggleGroup type="multiple" className="flex flex-wrap border">
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

const Editor = ({
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
    <div
      className={cn(
        'rounded-md border',
        error ? 'border-destructive' : 'border-border'
      )}
    >
      {editor && (
        <div className="bg-background sticky top-0 z-[2]">
          <MenuBar editor={editor} />
        </div>
      )}
      <div
        className={cn(
          'p-3'
          // error ? 'border-destructive border' : 'border-border border'
        )}
      >
        {error && <p className="text-destructive text-xs">{error}</p>}
        <EditorContent
          editor={editor}
          className="editor max-w-none border-none outline-none focus-within:border-none"
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
  const { loading } = useSelector(selectPostState);
  const dispatch = useDispatch<AppDispatch>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const handleUpload = async () => {
    if (!file) return;
    const result = await dispatch(uploadContentImage({ photo: file }));
    if (uploadContentImage.fulfilled.match(result)) {
      const url = result.payload.data.url;
      onClick(url);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setImageSrc('');
  };

  const onDrop = (files: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      fireToast('error', fileRejections[0].errors[0].message, 2000);
      return;
    }
    const file = files[0];
    const src = URL.createObjectURL(file);
    if (!src) {
      fireToast('error', 'Something went wrong', 2000);
      return;
    }
    setImageSrc(src);
    setFile(file);
  };

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg, .jpeg'],
        'image/gif': ['.gif'],
      },
      maxFiles: 1,
      maxSize: 2 * 1024 * 1024, // 2mb
      multiple: false,
      onDrop,
    });

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          handleCancel();
        }
      }}
    >
      <PopoverTrigger className="hover:bg-accent cursor-pointer px-2">
        <ImageIcon className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="bg-background border-border ring-ring/50 z-[1] mt-4 w-[350px] rounded-lg p-2 ring-2">
        {imageSrc ? (
          <div className="flex flex-col space-y-4">
            <NextImage
              src={imageSrc}
              width={400}
              height={400}
              alt="content-image"
              className="w-full"
            />
            <div className="flex items-center justify-end space-x-2">
              <Button
                disabled={loading}
                onClick={handleCancel}
                type="button"
                size={'sm'}
                variant={'secondary'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={loading}
                type="button"
                size={'sm'}
              >
                {!loading ? 'Upload' : <Loader className="animate-spin" />}
              </Button>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="bg-accent border-border flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-16 hover:brightness-75"
          >
            <input {...getInputProps()} />
            <span>
              <Camera size={32} />
            </span>
            <span className="text-center text-xs text-balance">
              Drag and drop or select thumbnail.
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Editor;
