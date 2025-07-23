import React from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Calendar, Clock, Heart, MessageCircle } from 'lucide-react';
import { PostCardValues } from '@/types/types';

const Card = ({ post }: { post: PostCardValues }) => {
  return (
    <div className="bg-card group overflow-hidden rounded-lg shadow-lg">
      {post.thumbnail && (
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
            <Link href={`/post/${post.slug}`}>
              <Image
                src={post.thumbnail}
                fill
                alt={post.title}
                className="object-cover object-center duration-150 group-hover:scale-105"
              />
            </Link>
          </AspectRatio>
        </div>
      )}
      <div className="p-3 sm:p-6">
        <div className="flex flex-col space-y-4">
          <p className="w-full text-start text-xs">4 mins read</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center justify-start gap-1">
              <Link
                className="bg-accent rounded-sm px-2 py-[3px] text-xs hover:brightness-75"
                href={`/category/${post.category.slug}`}
              >
                {post.category.name}
              </Link>
              {post.subCategory && (
                <Link
                  className="bg-accent rounded-sm px-2 py-[3px] text-xs hover:brightness-75"
                  href={`/category/${post.category.slug}/${post.subCategory?.slug}`}
                >
                  {post.subCategory.name}
                </Link>
              )}
            </div>
            <div>
              <p className="text-muted-foreground flex items-center space-x-[4px] text-xs whitespace-nowrap">
                <span>
                  <Calendar size={14} />
                </span>
                <span>{formatDistanceToNow(post.created_at)}</span>
              </p>
            </div>
          </div>
          <Link href={`/post/${post.slug}`}>
            <h1 className="line-clamp-3 overflow-hidden text-2xl font-semibold text-ellipsis hover:underline">
              {post.title}
            </h1>
          </Link>
          <Link href={`/post/${post.slug}`}>
            <p className="text-muted-foreground line-clamp-4 overflow-hidden text-sm text-ellipsis">
              {post.summary}
            </p>
          </Link>
          <p className="flex flex-wrap gap-[8px]">
            {post.tags.map((el) => (
              <Link
                href={`/tag/${el.slug}`}
                className="text-muted-foreground hover:text-foreground text-xs hover:underline"
              >
                #{el.name}
              </Link>
            ))}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
              <Link href={`/author/${post.author.username}`}>
                <Image
                  src={post.author.avatar ?? '/images/profile-placeholder.png'}
                  alt={post.author.fullname}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </Link>
              <div>
                <Link href={`/author/${post.author.username}`}>
                  <p className="text-foreground text-base font-medium">
                    {post.author.fullname}
                  </p>
                </Link>
                <Link href={`/author/${post.author.username}`}>
                  <p className="text-xs">@{post.author.username}</p>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="flex items-center space-x-[2px] text-xs">
                <Heart size={12} />
                <span>1.1K</span>
              </p>
              <p className="flex items-center space-x-[2px] text-xs">
                <MessageCircle size={12} />
                <span>300</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
