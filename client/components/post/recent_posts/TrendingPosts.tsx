import { AspectRatio } from '@/components/ui/aspect-ratio';
import { env } from '@/config/env';
import { getTransformedCloudinaryUrl } from '@/utils/getTransformedCloudinaryUrl';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const getPosts = async () => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/post/trending`;
    const response = await axios.get(url);
    const posts = response.data?.data ?? [];
    return posts;
  } catch (error) {
    return redirect('/error');
  }
};

const TrendingPosts = async () => {
  const posts = await getPosts();
  return (
    <div>
      <h2 className="border-foreground flex w-full items-center space-x-2 border-b-2 pb-2 text-2xl font-semibold uppercase">
        <TrendingUp className="text-green-500" />
        <span>Trending</span>
      </h2>
      <div className="mt-4 flex flex-col space-y-8">
        {posts.map((post: any, index: number) => {
          const postLink = '/post/' + post.slug;
          return (
            <div key={'trending-post-' + index} className="flex space-x-4">
              {post.thumbnail && (
                <div className="relative aspect-[16/9] h-20 overflow-hidden rounded-md">
                  <Link href={postLink}>
                    <Image
                      src={getTransformedCloudinaryUrl(post.thumbnail, {
                        height: 90,
                        width: 160,
                        crop: 'fill',
                        quality: 'auto:eco',
                      })}
                      alt={post.title}
                      className="object-cover object-center duration-150 hover:scale-125"
                      fill
                    />
                  </Link>
                </div>
              )}
              <div className="flex-1">
                <p className="text-muted-foreground mb-1 text-xs">
                  {formatDistanceToNow(post.updated_at)}
                </p>
                <Link href={postLink}>
                  <h2 className="mb-3 line-clamp-2 overflow-hidden leading-tight font-semibold text-ellipsis hover:underline">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground text-xs">
                  By&nbsp;
                  <Link
                    className="hover:underline"
                    href={`/author/${post.author.username}`}
                  >
                    {post.author.fullname}
                  </Link>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingPosts;
