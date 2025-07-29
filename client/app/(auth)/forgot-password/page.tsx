import ForgotPasswordForm from '@/components/auth/forgot_password/ForgotPasswordForm';
import { Suspense } from 'react';

const page = () => {
  return (
    <div className="w-full">
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
