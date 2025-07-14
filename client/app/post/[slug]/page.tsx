import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  try {
    const { slug } = params;

    const url = `${env.NEXT_PUBLIC_BASE_URL}/post/${slug}`;
    const response = await axios.get(url);
    const post = response.data.data;

    return (
      <div>
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.log(error);
    redirect('/error');
  }
};

export default page;
