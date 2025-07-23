import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';
import AutoLoadMorePosts from './AutoLoad';

const fetchPosts = async (page?: number) => {
  try {
    const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/tag`);
    if (page) {
      url.searchParams.append('page', String(page));
    }
    const response = await axios.get(url.toString());
    return response.data?.data.tags;
  } catch (error) {
    return redirect('/error');
  }
};

const List = async ({ page }: { page: number }) => {
  const tags = await fetchPosts(page);
  const url = `${env.NEXT_PUBLIC_BASE_URL}/tag`;
  return (
    <AutoLoadMorePosts initialPage={page} initialData={tags} initialUrl={url} />
  );
};

export default List;
