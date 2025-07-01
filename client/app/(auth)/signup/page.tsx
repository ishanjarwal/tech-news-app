import Restricted from '@/components/auth/Restricted';
import SignUpForm from '@/components/auth/signup/SignUpForm';

const page = () => {
  return (
    <Restricted>
      <div className="w-full">
        <SignUpForm />
      </div>
    </Restricted>
  );
};

export default page;
