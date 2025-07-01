'use client';
import { CustomPasswordInput } from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { logo } from '@/constants/constants';
import { decodeJWT } from '@/lib/utils';
import {
  resetPassword,
  resetRedirect,
  resetValidationErrors,
  selectUserState,
} from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { PasswordResetSchema, PasswordResetValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const ResetPasswordForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, redirect } = useSelector(selectUserState);
  const params = useParams();
  const token = params?.token as string;
  const email = decodeJWT(token)?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetValues>({
    defaultValues: { password: '', password_confirmation: '' },
    resolver: zodResolver(PasswordResetSchema),
  });

  useEffect(() => {
    if (redirect) {
      router.push(redirect);
    }
  }, [redirect]);

  const onSubmit = (data: PasswordResetValues) => {
    dispatch(resetPassword({ ...data, token }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetValidationErrors());
      dispatch(resetRedirect());
    };
  }, []);

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
                disabled={loading}
                register={register}
                name={'password'}
                error={errors.password}
                labelText="New Password"
              />
              <CustomPasswordInput
                disabled={loading}
                register={register}
                name={'password_confirmation'}
                error={errors.password_confirmation}
                labelText="Confirm Password"
              />
              <div className="flex flex-col">
                <Button
                  disabled={loading}
                  type="submit"
                  className="mt-2 w-full"
                >
                  {!loading ? 'Reset' : <Loader className="animate-spin" />}
                </Button>
              </div>
              <Separator orientation="horizontal" className="my-0" />
              <Link
                href={`/forgot-password${email && '?email=' + email}`}
                className="mx-auto w-max text-center text-blue-500"
              >
                Resend Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
