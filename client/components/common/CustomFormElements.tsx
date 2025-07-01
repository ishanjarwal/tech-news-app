'use client';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface CustomFormInputProps {
  name: string;
  labelText: string;
  register: UseFormRegister<any>; // or use a generic for typed forms
  error?: FieldError;
  autoFocus?: boolean;
  disabled?: boolean;
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

export { CustomFormInput, CustomPasswordInput };
