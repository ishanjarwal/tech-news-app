'use client';
import {
  CustomFormInput,
  CustomPasswordInput,
} from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { auth, logo } from '@/constants/constants';
import { UserLoginSchema, UserLoginValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import GoogleAuthButton from '../GoogleAuthButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/stores/appstore';
import {
  loginUser,
  resetValidationErrors,
  selectUserState,
} from '@/reducers/userReducer';
import { useRouter } from 'next/navigation';
import { Loader, X } from 'lucide-react';
import { useEffect } from 'react';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, errors: validation_errors } = useSelector(selectUserState);
  const router = useRouter();

  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginValues>({
    defaultValues: { email_username: '', password: '' },
    resolver: zodResolver(UserLoginSchema),
  });

  const onSubmit = (data: UserLoginValues) => {
    const { password, email_username } = data;
    dispatch(loginUser({ email_username, password }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetValidationErrors());
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto flex h-full max-w-sm items-center justify-center">
        <div className="flex w-full flex-col items-center gap-y-8 px-2 md:px-4">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <Link href={logo.url}>
                <Logo className="h-10" />
              </Link>
            </div>
            <h1 className="text-3xl font-semibold">Welcome Back!</h1>
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
            <div className="flex flex-col gap-6">
              <CustomFormInput
                disabled={loading}
                register={register}
                name={'email_username'}
                error={errors.email_username}
                labelText="Email or Username"
              />
              <CustomPasswordInput
                disabled={loading}
                register={register}
                name={'password'}
                error={errors.password}
                labelText="Password"
              />
              <div className="flex justify-end">
                <Link
                  href={'/forgot-password'}
                  className="text-end text-xs text-blue-600"
                >
                  Forgot Password ?
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  disabled={loading}
                  type="submit"
                  className="mt-2 w-full"
                >
                  {!loading ? 'Login' : <Loader className="animate-spin" />}
                </Button>
                <GoogleAuthButton />
              </div>
            </div>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Don't have an account ?</p>
            <Link
              href={auth.signup.href}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
