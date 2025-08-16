import { env } from '@/config/env';
import type { MetadataRoute } from 'next';

const fetchPostSlugs = async () => {
  const postSlugsURL = `${env.NEXT_PUBLIC_BASE_URL}/sitemap/post-slugs`;
  const res = await fetch(postSlugsURL);
  if (!res.ok) {
    throw new Error('Something went wrong while creating sitemap');
  }
  return await res.json();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postSlugs = await fetchPostSlugs().catch(() => ({ data: [] }));

  const sitemapArray = [
    {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}`,
    },
    {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/archive`,
    },
    {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/most-viewed`,
    },
    {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/most-liked`,
    },
    {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/topics`,
    },
    {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/categories`,
    },
    ...postSlugs.data.map((el: { slug: string }) => ({
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/post/${el.slug}`,
    })),
  ];

  return sitemapArray;
}
