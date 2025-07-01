'use client';
import {
  CustomFormInput,
  CustomPasswordInput,
} from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { auth, logo } from '@/constants/constants';
import { UserSignUpSchema, UserSignUpValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import GoogleAuthButton from '../GoogleAuthButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/stores/appstore';
import {
  registerUser,
  resetValidationErrors,
  resetVerificationEmail,
  selectUserState,
} from '@/reducers/userReducer';
import { Loader, X } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    errors: validation_errors,
    verification_email,
  } = useSelector(selectUserState);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSignUpValues>({
    defaultValues: { email: '', fullname: '', password: '', username: '' },
    resolver: zodResolver(UserSignUpSchema),
  });

  const onSubmit = (data: UserSignUpValues) => {
    const { username, fullname, password, email } = data;
    dispatch(registerUser({ username, fullname, email, password }));
  };

  useEffect(() => {
    let timeout: any;
    if (verification_email) {
      timeout = setTimeout(() => {
        router.push(`/verify?email=${verification_email}`);
        dispatch(resetVerificationEmail());
      }, 1500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [verification_email]);

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
            <h1 className="text-3xl font-semibold">Create an Account</h1>
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
            <div className="flex flex-col gap-8">
              <CustomFormInput
                disabled={loading}
                register={register}
                name={'fullname'}
                error={errors.fullname}
                labelText={'Full Name'}
              />
              <CustomFormInput
                disabled={loading}
                register={register}
                name={'email'}
                error={errors.email}
                labelText={'Email'}
              />
              <CustomFormInput
                disabled={loading}
                register={register}
                name={'username'}
                error={errors.username}
                labelText={'Username'}
              />
              <CustomPasswordInput
                disabled={loading}
                register={register}
                name={'password'}
                error={errors.password}
                labelText={'Password'}
              />
              <div className="flex flex-col gap-4">
                <Button
                  disabled={loading}
                  type="submit"
                  className="mt-2 w-full"
                >
                  {!loading ? 'Sign Up' : <Loader className="animate-spin" />}
                </Button>
                <GoogleAuthButton />
              </div>
            </div>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Already have an account ?</p>
            <Link
              href={auth.login.href}
              className="text-primary font-medium hover:underline"
            >
              Login instead
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
