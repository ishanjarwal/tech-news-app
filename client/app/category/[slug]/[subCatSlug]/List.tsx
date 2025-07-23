import Card from '@/components/post_card/Card';
import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React from 'react';
import AutoLoadMorePosts from './AutoLoadMorePosts';

const fetchPosts = async (slug: string, subCategorySlug: string) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/post?category=${slug}&subcategory=${subCategorySlug}`;
    const response = await axios.get(url);
    return response.data?.data.posts;
  } catch (error) {
    return redirect('/error');
  }
};

const List = async ({
  slug,
  subCategorySlug,
  page,
}: {
  slug: string;
  subCategorySlug: string;
  page: number;
}) => {
  const posts = await fetchPosts(slug, subCategorySlug);
  const url = `${env.NEXT_PUBLIC_BASE_URL}/post/?category=${slug}&subcategory=${subCategorySlug}`;
  return (
    <AutoLoadMorePosts
      initialPage={page}
      initialPosts={posts}
      initialUrl={url}
    />
  );
};

export default List;
