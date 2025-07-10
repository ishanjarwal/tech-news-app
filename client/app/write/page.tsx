import Protected from '@/components/auth/Protected';
import WriteForm from '@/components/write/WriteForm';

const page = () => {
  return (
    <Protected roles={['author']}>
      <div className="mx-auto max-w-3xl py-8 sm:py-16">
        <h1 className="text-center text-3xl font-bold">Write a new post</h1>
        <div className="px-4 py-16 sm:px-0">
          <WriteForm />
        </div>
      </div>
    </Protected>
  );
};

export default page;
