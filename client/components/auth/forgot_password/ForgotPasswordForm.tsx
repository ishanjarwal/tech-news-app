'use client';
import { CustomFormInput } from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { auth, logo } from '@/constants/constants';
import { EmailSchema, EmailValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = (data: EmailValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mx-auto flex h-full max-w-sm items-center justify-center">
        <Button
          asChild
          className="absolute top-0 left-0 cursor-pointer"
          variant={'ghost'}
          size={'sm'}
        >
          <Link href={auth.login.href}>
            <ChevronLeft size={16} />
            <span>Back</span>
          </Link>
        </Button>
        <div className="flex w-full flex-col items-center gap-y-8 px-2 md:px-4">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <Link href={logo.url}>
                <Logo className="h-10" />
              </Link>
            </div>
            <h1 className="text-3xl font-semibold">Recover your password</h1>
          </div>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-0">
              <CustomFormInput
                register={register}
                name={'email'}
                error={errors.email}
                labelText="Email"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  Send Reset Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
