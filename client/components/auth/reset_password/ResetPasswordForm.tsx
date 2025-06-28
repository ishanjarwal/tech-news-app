'use client';
import { CustomPasswordInput } from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { logo } from '@/constants/constants';
import { PasswordResetSchema, PasswordResetValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetValues>({
    defaultValues: { password: '', password_confirmation: '' },
    resolver: zodResolver(PasswordResetSchema),
  });

  const onSubmit = (data: PasswordResetValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto flex h-full max-w-sm items-center justify-center">
        <div className="flex w-full flex-col items-center gap-y-12 px-2 md:px-4">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <Link href={logo.url}>
                <Logo className="h-10" />
              </Link>
            </div>
            <h1 className="text-3xl font-semibold">Reset your Password</h1>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-8">
              <CustomPasswordInput
                register={register}
                name={'password'}
                error={errors.password}
                labelText="New Password"
              />
              <CustomPasswordInput
                register={register}
                name={'password_confirmation'}
                error={errors.password_confirmation}
                labelText="Confirm Password"
              />
              <div className="flex flex-col">
                <Button type="submit" className="mt-2 w-full">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
