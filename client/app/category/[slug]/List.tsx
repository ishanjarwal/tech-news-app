import Card from '@/components/post_card/Card';
import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React from 'react';
import AutoLoadMorePosts from './AutoLoadMorePosts';

const fetchPosts = async (slug: string, page?: number) => {
  try {
    const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/post?category=${slug}`);
    if (page) {
      url.searchParams.append('page', String(page));
    }
    const response = await axios.get(url.toString());
    return response.data?.data.posts;
  } catch (error) {
    return redirect('/error');
  }
};

const List = async ({ slug, page }: { slug: string; page: number }) => {
  const posts = await fetchPosts(slug, page);
  const url = `${env.NEXT_PUBLIC_BASE_URL}/post/?category=${slug}`;
  return (
    <AutoLoadMorePosts
      initialPage={page}
      initialPosts={posts}
      initialUrl={url}
    />
  );
};

export default List;
