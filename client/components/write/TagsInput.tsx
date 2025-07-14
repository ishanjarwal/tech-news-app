import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Loader, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';
import { Input } from '../ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { resetTags, searchTags, selectTagState } from '@/reducers/tagReducer';
import { AppDispatch } from '@/stores/appstore';
import { NewPostValues } from '@/validations/post';

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
  control: Control<NewPostValues>;
}

const TagInput = ({ control, error }: TagInputProps) => {
  const { tags, loading: tagLoading } = useSelector(selectTagState);
  const dispatch = useDispatch<AppDispatch>();

  const [input, setInput] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const debounced = useDebounce(input, 1000);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounced) {
      dispatch(searchTags({ q: debounced }));
    }
    if (!open) {
      dispatch(resetTags());
    }
  }, [debounced, open]);

  return (
    <div>
      <p className="mb-2 text-sm">Tags</p>
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const addTag = (value: string) => {
            const newTags = Array.from(new Set([...field.value, value]));
            field.onChange(newTags);
          };

          const removeTag = (value: string) => {
            const newTags = field.value.filter((tag: string) => tag !== value);
            field.onChange(newTags);
          };

          return (
            <div className="border-border flex max-w-sm flex-col space-y-2 rounded-md border p-2">
              {error && (
                <p className="text-destructive text-xs">{error.message}</p>
              )}
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((tag: string) => (
                    <span className="bg-foreground/10 flex items-center space-x-[4px] rounded-md px-2 py-1">
                      <span>{tag}</span>
                      <span onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </span>
                    </span>
                  ))}
                </div>
              )}
              <div>
                <div>
                  <Input
                    ref={inputRef}
                    onFocus={() => setOpen(true)}
                    onBlur={(e) => {
                      if (e.relatedTarget !== listRef.current) {
                        setOpen(false);
                      }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    className={cn(
                      open && input && 'rounded-b-none',
                      'focus-visible:ring-0'
                    )}
                    placeholder="Add tags"
                  />
                </div>
                {open && (
                  <div ref={listRef} tabIndex={-1}>
                    {input && (
                      <div className="border-input rounded-b-lg border p-2">
                        {tagLoading ? (
                          <div className="flex items-center justify-center px-4 py-8">
                            <Loader className="text-muted-foreground animate-spin" />
                          </div>
                        ) : tags && tags.length <= 0 ? (
                          <div className="flex items-center justify-center px-4 py-8">
                            <p className="text-muted-foreground text-xs">
                              No tags found
                            </p>
                          </div>
                        ) : (
                          <div className="flex max-h-[450px] flex-col space-y-1 overflow-auto">
                            {(tags || []).map((el) => (
                              <div
                                onClick={() => {
                                  inputRef.current?.focus();
                                  addTag(el.slug);
                                }}
                                className="hover:bg-muted cursor-pointer rounded-md px-2 py-1"
                              >
                                <p className="text-sm font-bold">#{el.slug}</p>
                                <p className="mt-2 text-xs">{el.name}</p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {el.summary}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default TagInput;
