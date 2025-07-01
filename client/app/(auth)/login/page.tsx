import LoginForm from '@/components/auth/login/LoginForm';
import Restricted from '@/components/auth/Restricted';

const page = () => {
  return (
    <Restricted>
      <div className="w-full">
        <LoginForm />
      </div>
    </Restricted>
  );
};

export default page;
