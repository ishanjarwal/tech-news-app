import { useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { cn } from '@/lib/utils';

interface TagInputProps {
  error?:
    | Merge<
        FieldError,
        (
          | Merge<
              FieldError,
              FieldErrorsImpl<{
                value: string;
              }>
            >
          | undefined
        )[]
      >
    | undefined;
  control: Control<any>;
}

const options = [
  { value: 'git', label: 'git' },
  { value: 'c++', label: 'c++' },
  { value: 'Python', label: 'Python' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'C', label: 'C' },
  { value: 'AI', label: 'AI' },
];

const TagInput = ({ control, error }: TagInputProps) => {
  return (
    <div>
      <p className="mb-2 text-sm">Tags</p>
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const [open, setOpen] = useState(false);
          const commandList = useRef<HTMLDivElement>(null);
          const inputRef = useRef<HTMLInputElement>(null);

          const selectedTags: string[] = field.value || [];

          const toggleTag = (value: string) => {
            const exists = selectedTags.includes(value);
            const newTags = exists
              ? selectedTags.filter((tag) => tag !== value)
              : [...selectedTags, value];

            field.onChange(newTags);
          };

          const removeTag = (value: string) => {
            const newTags = selectedTags.filter((tag) => tag !== value);
            field.onChange(newTags);
          };

          const selectedOptions = options.filter((o) =>
            selectedTags.includes(o.value)
          );
          const unselectedOptions = options.filter(
            (o) => !selectedTags.includes(o.value)
          );

          return (
            <div className="border-border flex max-w-sm flex-col space-y-2 rounded-md border p-2">
              {error && (
                <p className="text-destructive text-xs">{error.message}</p>
              )}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span className="bg-foreground/10 flex items-center space-x-[4px] rounded-md px-2 py-1">
                      <span>{tag}</span>
                      <span onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </span>
                    </span>
                  ))}
                </div>
              )}
              <Command>
                <CommandInput
                  ref={inputRef}
                  onFocus={() => setOpen(true)}
                  onBlur={(e) => {
                    if (e.relatedTarget !== commandList.current) {
                      setOpen(false);
                    }
                  }}
                  placeholder={open ? 'Search for Tags' : 'Add tags'}
                  className="h-9"
                />
                {open && (
                  <CommandList
                    ref={commandList}
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <CommandEmpty>No tags found</CommandEmpty>
                    <CommandGroup>
                      {[...selectedOptions, ...unselectedOptions].map(
                        (option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => toggleTag(option.value)}
                          >
                            #{option.label}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                selectedTags.includes(option.value)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        )
                      )}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>
          );
        }}
      />
    </div>
  );
};

export default TagInput;
