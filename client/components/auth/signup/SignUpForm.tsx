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

const SignUpForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSignUpValues>({
    defaultValues: { email: '', fullname: '', password: '', username: '' },
    resolver: zodResolver(UserSignUpSchema),
  });

  const onSubmit = (data: UserSignUpValues) => {
    console.log(data);
  };

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
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-8">
              <CustomFormInput
                register={register}
                name={'fullname'}
                error={errors.fullname}
                labelText={'Full Name'}
              />
              <CustomFormInput
                register={register}
                name={'email'}
                error={errors.email}
                labelText={'Email'}
              />
              <CustomFormInput
                register={register}
                name={'username'}
                error={errors.username}
                labelText={'Username'}
              />
              <CustomPasswordInput
                register={register}
                name={'password'}
                error={errors.password}
                labelText={'Password'}
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  Sign Up
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
