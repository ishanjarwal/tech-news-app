'use client';
import { CustomFormInput } from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { auth, logo } from '@/constants/constants';
import {
  resetPasswordLink,
  resetRedirect,
  resetValidationErrors,
  selectUserState,
} from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { EmailSchema, EmailValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const ForgotPasswordForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    errors: validation_errors,
    redirect,
  } = useSelector(selectUserState);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailValues>({
    defaultValues: { email: email ? email : '' },
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = (data: EmailValues) => {
    dispatch(resetPasswordLink(data));
  };

  useEffect(() => {
    if (redirect) {
      router.push(redirect);
    }
  }, [redirect]);

  useEffect(() => {
    return () => {
      dispatch(resetValidationErrors());
      dispatch(resetRedirect());
    };
  }, []);

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
          {validation_errors && (
            <div className="border-destructive bg-destructive/10 text-destructive w-full rounded-lg px-3 py-2">
              {validation_errors.map((el) => (
                <p className="flex items-start justify-start space-x-1">
                  <X size={16} className="mt-[3px]" />
                  <span>{el.msg}</span>
                </p>
              ))}
            </div>
          )}
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-0">
              <CustomFormInput
                disabled={loading}
                register={register}
                name={'email'}
                error={errors.email}
                labelText="Email"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  {!loading ? (
                    'Send Reset Link'
                  ) : (
                    <Loader className="animate-spin" />
                  )}
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
