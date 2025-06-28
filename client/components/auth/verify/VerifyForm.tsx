'use client';
import { CustomFormInput } from '@/components/common/CustomFormElements';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { logo } from '@/constants/constants';
import { setSearchParam } from '@/lib/utils';
import { VerifySchema, VerifyValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Link from 'next/link';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FieldErrors,
  useForm,
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import OTPInput from './OTPInput';

const VerifyForm = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [changeEmail, setChangeEmail] = useState<boolean>(false);

  const {
    watch,
    trigger,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyValues>({
    defaultValues: { otp: '', email: email ? email : '' },
    resolver: zodResolver(VerifySchema),
  });

  const onSubmit = (data: VerifyValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mx-auto flex h-full max-w-sm items-center justify-center">
        <div className="flex w-full flex-col items-center gap-y-8 px-2 md:px-4">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <Link href={logo.url}>
                <Logo className="h-10" />
              </Link>
            </div>
            <h1 className="text-3xl font-semibold">Verify Account</h1>
            <p className="text-muted-foreground text-center text-sm">
              A 4-digit verification code has been sent to your email address,
              please verify your account to continue.
            </p>
          </div>
          {email && <p>{email}</p>}
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-0">
              <div className="flex flex-col gap-y-2 py-8">
                <OTPInput
                  disabled={changeEmail}
                  name="otp"
                  setValue={setValue}
                  watch={watch}
                  length={4}
                />
                {errors.otp && (
                  <p className="text-destructive text-center text-xs">
                    {errors.otp.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  disabled={changeEmail}
                  type="submit"
                  className="mt-2 w-full"
                >
                  Verify
                </Button>
              </div>
              <Separator orientation="horizontal" className="my-8" />
              <div className="flex items-center justify-center">
                {changeEmail || errors.email ? (
                  <ChangeEmailForm
                    changeEmail={changeEmail}
                    watch={watch}
                    router={router}
                    pathname={pathname}
                    searchParams={searchParams}
                    register={register}
                    errors={errors}
                    trigger={trigger}
                    setChangeEmail={setChangeEmail}
                  />
                ) : (
                  <span
                    onClick={() => setChangeEmail(true)}
                    className="cursor-pointer text-center text-sm text-blue-500"
                  >
                    Change Email
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

interface ChangeEmailProps {
  changeEmail: boolean;
  router: AppRouterInstance;
  watch: UseFormWatch<VerifyValues>;
  register: UseFormRegister<any>;
  errors: FieldErrors<VerifyValues>;
  trigger: UseFormTrigger<VerifyValues>;
  setChangeEmail: (val: boolean) => void;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}

const ChangeEmailForm = ({
  changeEmail,
  router,
  watch,
  register,
  errors,
  trigger,
  setChangeEmail,
  pathname,
  searchParams,
}: ChangeEmailProps) => {
  const validateEmail = async () => {
    const isValid = await trigger('email');
    if (isValid) {
      setSearchParam('email', watch('email'), pathname, searchParams, router);
      setChangeEmail(false);
    }
  };

  useEffect(() => {
    if (!changeEmail) {
      setChangeEmail(true);
    }
  });

  return (
    <div className="flex w-full flex-col gap-2">
      <CustomFormInput
        autoFocus={true}
        register={register}
        labelText="Email"
        name="email"
        error={errors.email}
      />
      <Button
        disabled={errors.email ? true : false}
        type="button"
        onClick={validateEmail}
      >
        Done
      </Button>
    </div>
  );
};

export default VerifyForm;
