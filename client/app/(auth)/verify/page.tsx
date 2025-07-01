import Restricted from '@/components/auth/Restricted';
import VerifyForm from '@/components/auth/verify/VerifyForm';

const page = () => {
  return (
    <Restricted>
      <div className="w-full">
        <VerifyForm />
      </div>
    </Restricted>
  );
};

export default page;
