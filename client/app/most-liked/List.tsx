import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';
import AutoLoadMorePosts from './AutoLoadMorePosts';

const fetchPosts = async (page?: number) => {
  try {
    const url = new URL(
      `${env.NEXT_PUBLIC_BASE_URL}/post/page-posts?filter=most-liked`
    );
    if (page) {
      url.searchParams.append('page', String(page));
    }
    const response = await axios.get(url.toString());
    return response.data?.data.posts;
  } catch (error) {
    return redirect('/error');
  }
};

const List = async ({ page }: { page: number }) => {
  const posts = await fetchPosts(page);
  const url = `${env.NEXT_PUBLIC_BASE_URL}/post/page-posts?filter=most-liked`;
  return (
    <AutoLoadMorePosts
      initialPage={page}
      initialPosts={posts}
      initialUrl={url}
    />
  );
};

export default List;
