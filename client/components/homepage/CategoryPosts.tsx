'use client';

import { getTransformedCloudinaryUrl } from '@/utils/getTransformedCloudinaryUrl';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface CategoryPostProps {
  categoryPosts: {
    category: { name: string; slug: string };
    posts: {
      title: string;
      slug: string;
      created_at: Date;
      thumbnail?: string;
    }[];
  }[];
}

const CategoryPosts = ({ categoryPosts }: CategoryPostProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const container = scrollContainerRef.current;
    const section = container?.querySelector(
      `#${sectionId}`
    ) as HTMLElement | null;

    if (section && container) {
      const containerTop = container.getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;
      const offset = sectionTop - containerTop;

      container.scrollTo({
        top: container.scrollTop + offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border lg:flex">
      <div className="flex overflow-auto border-r lg:flex-col">
        {categoryPosts.map((el, index) => (
          <button
            key={'categor-button-' + index}
            onClick={() => scrollToSection('category-' + el.category.slug)}
            className={cn(
              'hover:bg-accent/50 cursor-pointer border-r px-4 py-3 whitespace-nowrap duration-150 lg:border-r-0 lg:border-b'
            )}
          >
            {categoryPosts[index].category.name}
          </button>
        ))}
      </div>
      <div className="!h-[450px] flex-1 overflow-auto" ref={scrollContainerRef}>
        {categoryPosts.map((categorypost, index) => {
          return (
            <div
              key={'section-' + categorypost.category.slug}
              id={'category-' + categorypost.category.slug}
            >
              <h2 className="bg-accent/50 px-4 py-2 text-3xl font-bold">
                {categorypost.category.name}
              </h2>
              <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2 xl:grid-cols-3">
                {categorypost.posts.map((post) => (
                  <div
                    key={categorypost.category.slug + '-post-' + index}
                    className="flex space-x-4"
                  >
                    {post.thumbnail && (
                      <div className="relative aspect-[16/9] h-20 overflow-hidden rounded-md">
                        <Link href={`/post/${post.slug}`}>
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
                        {formatDistanceToNow(post.created_at)}
                      </p>
                      <Link href={`/post/${post.slug}`}>
                        <h2 className="mb-3 line-clamp-2 overflow-hidden leading-tight font-semibold text-ellipsis hover:underline">
                          {post.title}
                        </h2>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPosts;
