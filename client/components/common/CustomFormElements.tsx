'use client';
import { Check, ChevronsUpDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  UseFormRegister,
} from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PREFERENCES_THEMES } from '@/validations/profile';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';

interface CustomFormInputProps {
  name: string;
  labelText: string;
  register: UseFormRegister<any>; // or use a generic for typed forms
  error?: FieldError;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}
const CustomFormInput = ({
  labelText,
  register,
  name,
  error,
  autoFocus,
  disabled,
}: CustomFormInputProps) => {
  return (
    <div>
      <div className="relative flex flex-col">
        <Input
          disabled={disabled}
          autoFocus={autoFocus}
          {...register(name)}
          type="text"
          className={cn(
            'peer',
            error &&
              'border-destructive ring-destructive/50 focus-visible:ring-destructive/50 focus-visible:border-destructive'
          )}
          placeholder=""
        />
        <Label className="text-muted-foreground pointer-events-none absolute -top-5 text-xs duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-x-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-110 peer-focus-within:-top-5 peer-focus-within:translate-x-0 peer-focus-within:-translate-y-0 peer-focus-within:scale-100">
          {labelText}
        </Label>
      </div>
      {error && (
        <p className="text-destructive ms-1 text-xs">{error.message}</p>
      )}
    </div>
  );
};

const CustomPasswordInput = ({
  labelText,
  register,
  name,
  error,
  disabled,
}: CustomFormInputProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div>
      <div
        className={cn(
          'border-border focus-within:border-ring focus-within:ring-ring/50 bg-accent relative flex items-center rounded-md border pe-2 shadow-xs duration-75 focus-within:ring-[3px]',
          error &&
            'border-destructive ring-destructive/50 focus-within:ring-destructive/50 focus-within:border-destructive'
        )}
      >
        <Input
          disabled={disabled}
          {...register(name)}
          type={show ? 'text' : 'password'}
          className="peer border-0 !bg-transparent shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
          placeholder=""
        />
        <button
          type="button"
          className={cn(
            !disabled && 'cursor-pointer',
            disabled && 'text-muted-foreground'
          )}
          onClick={() => setShow((prev) => !prev)}
          disabled={disabled}
        >
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <Label className="text-muted-foreground pointer-events-none absolute -top-5 text-xs duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-x-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-110 peer-focus-within:-top-5 peer-focus-within:translate-x-0 peer-focus-within:-translate-y-0 peer-focus-within:scale-100">
          {labelText}
        </Label>
      </div>
      {error && (
        <p className="text-destructive ms-1 text-xs">{error.message}</p>
      )}
    </div>
  );
};

const CustomTextboxInput = ({
  labelText,
  register,
  name,
  error,
  autoFocus,
  disabled,
  className,
}: CustomFormInputProps) => {
  return (
    <div>
      <div className="relative flex flex-col">
        <Textarea
          disabled={disabled}
          autoFocus={autoFocus}
          {...register(name)}
          className={cn(
            'peer max-h-[240px] min-h-[80px]',
            error &&
              'border-destructive ring-destructive/50 focus-visible:ring-destructive/50 focus-visible:border-destructive',
            className
          )}
          placeholder=""
        />
        <Label className="text-muted-foreground pointer-events-none absolute -top-5 text-xs duration-150 peer-placeholder-shown:top-6 peer-placeholder-shown:translate-x-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-110 peer-focus-within:-top-5 peer-focus-within:translate-x-0 peer-focus-within:-translate-y-0 peer-focus-within:scale-100">
          {labelText}
        </Label>
      </div>
      {error && (
        <p className="text-destructive ms-1 text-xs">{error.message}</p>
      )}
    </div>
  );
};

interface CustomCheckboxProps {
  control: Control;
  name: string;
  label: string;
  error?: FieldError;
  disabled?: boolean;
}

const CustomCheckboxInput = ({
  control,
  name,
  label,
  error,
  disabled,
}: CustomCheckboxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div>
            {error && (
              <p className="text-destructive ms-1 text-xs">{error.message}</p>
            )}
            <Label className="flex cursor-pointer items-center space-x-2">
              <Checkbox
                disabled={disabled}
                className="scale-110 cursor-pointer"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <p>{label}</p>
            </Label>
          </div>
        );
      }}
    />
  );
};

interface CustomRadioGroupProps {
  options: { label: string; value: string; disabled?: boolean }[];
  control: Control;
  name: string;
  error?: FieldError;
  defaultValue?: string;
  disabled?: boolean;
}

const CustomRadioGroupInput = ({
  control,
  name,
  options,
  error,
  defaultValue,
  disabled,
}: CustomRadioGroupProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div>
            {error && (
              <p className="text-destructive ms-1 text-xs">{error.message}</p>
            )}
            <RadioGroup
              disabled={disabled}
              defaultValue={defaultValue}
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              {options.map((el) => (
                <div key={el.value} className="flex items-center gap-3">
                  <Label className="bg-accent flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 capitalize hover:brightness-90">
                    <RadioGroupItem disabled={el.disabled} value={el.value} />
                    <p>{el.label}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }}
    />
  );
};

interface CustomSelectInputProps extends CustomFormInputProps {
  options: { label: string; value: string }[];
  notFoundLabel: string;
  control: Control<any>;
}

const CustomSelectInput = ({
  labelText,
  name,
  options,
  notFoundLabel,
  disabled,
  control,
  error,
}: CustomSelectInputProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          {error && <p className="text-destructive text-xs">{error.message}</p>}
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'w-full justify-between',
                error ? '!border-destructive' : '!border-border'
              )}
            >
              {field.value
                ? options.find((option) => option.value === field.value)?.label
                : 'Select ' + labelText}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput
                disabled={disabled}
                placeholder={'Search ' + labelText}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>{notFoundLabel}</CommandEmpty>
                <CommandGroup value={field.value}>
                  {options.map((option) => (
                    <CommandItem
                      onSelect={() => {
                        field.onChange(option.value);
                        setOpen(false);
                      }}
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          field.value === option.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
};

export {
  CustomFormInput,
  CustomPasswordInput,
  CustomTextboxInput,
  CustomCheckboxInput,
  CustomRadioGroupInput,
  CustomSelectInput,
};
