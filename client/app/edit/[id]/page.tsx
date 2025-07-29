import Protected from '@/components/auth/Protected';
import EditForm from '@/components/edit/EditForm';
import { env } from '@/config/env';
import { mapPost } from '@/utils/mappers';
import axios from 'axios';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  try {
    const { id } = await params;
    const url = `${env.NEXT_PUBLIC_BASE_URL}/post/id/${id}`;
    const response = await axios.get(url, { withCredentials: true });
    const post = mapPost(response.data.data);
    return (
      <Protected roles={['author']}>
        <div className="mx-auto max-w-3xl py-8 sm:py-16">
          <h1 className="text-center text-3xl font-bold">Edit post</h1>
          <div className="px-4 py-16 sm:px-0">
            <EditForm post={post} />
          </div>
        </div>
      </Protected>
    );
  } catch (error) {
    return redirect('/error');
  }
};

export default page;
