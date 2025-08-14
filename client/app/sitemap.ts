import { env } from '@/config/env';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
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
  ];
}
