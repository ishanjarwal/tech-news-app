'use client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const RecentPosts = () => {
  return (
    <div>
      <h2 className="border-foreground flex w-full items-center space-x-2 border-b-2 pb-2 text-2xl font-semibold uppercase">
        <TrendingUp className="text-green-500" />
        <span>Trending</span>
      </h2>
      <div className="mt-4 flex flex-col space-y-8">
        {Array.from({ length: 5 }).map((post, index) => (
          <div key={'trending-post-' + index} className="flex space-x-4">
            <div className="relative aspect-square size-24 overflow-hidden rounded-lg">
              <Link href={'/'}>
                <Image
                  src={'/images/banner-placeholder.jpg'}
                  alt="Post"
                  className="object-cover object-center duration-150 hover:scale-125"
                  fill
                />
              </Link>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground mb-1 text-xs">
                {formatDistanceToNow(new Date())}
              </p>
              <Link href={'/'}>
                <h2 className="mb-3 line-clamp-2 overflow-hidden leading-tight font-semibold text-ellipsis hover:underline">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Perspiciatis, aperiam culpa optio, nam natus error ex
                  molestiae libero, at temporibus dolore asperiores vitae quod
                  voluptas.
                </h2>
              </Link>
              <p className="text-muted-foreground text-xs">
                By&nbsp;
                <Link className="hover:underline" href={'/author/'}>
                  Clark Kent
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
