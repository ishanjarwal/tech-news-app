'use client';

import axios from 'axios';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const AutoLoad = ({
  initialUrl,
  initialData,
  initialPage,
}: {
  initialUrl: string;
  initialData: any[];
  initialPage: number;
}) => {
  const [authors, setAuthors] = useState<any[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [scrollThreshold, setScrollThreshold] = useState<string>('');

  const fetchNext = async () => {
    const nextPage = page + 1;
    const url = new URL(initialUrl);
    url.searchParams.append('page', String(nextPage));
    const res = await axios.get(url.toString());
    const newAuthors = res.data?.data.authors;

    if (!newAuthors || newAuthors.length === 0) {
      setHasMore(false);
    } else {
      setAuthors((prev) => [...prev, ...newAuthors]);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    if (initialData.length == 0) {
      setHasMore(false);
      return;
    }

    const footerEl = document.querySelector('#footer');
    if (footerEl) {
      const height = footerEl.getBoundingClientRect().height;
      setScrollThreshold(height + 20 + 'px');
    }
  });

  return (
    <InfiniteScroll
      scrollThreshold={scrollThreshold}
      dataLength={authors.length}
      next={fetchNext}
      hasMore={hasMore}
      loader={
        <p className="mx-auto flex items-center justify-center py-4">
          <Loader className="animate-spin" />
        </p>
      }
    >
      {initialData.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 pb-8 sm:gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {initialData.map((author: any, index: number) => (
            <Link
              key={'author-' + index}
              className="bg-card hover:bg-accent flex items-start gap-x-4 rounded-lg p-4 shadow-2xl duration-75"
              href={`/author/${author.username}`}
            >
              <div className="flex space-x-4">
                <div className="relative aspect-square size-24 overflow-hidden rounded-full">
                  <Image
                    src={author?.avatar ?? 'images/profile-placeholder.png'}
                    fill
                    alt={author.username}
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-xs sm:text-sm">{author.fullname}</p>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                    @{author.username}
                  </p>
                  <p className="text-muted-foreground mb-2 text-xs sm:text-sm">
                    {author.bio}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {author.totalPosts} posts
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {authors.map((author: any, index: number) => (
            <Link
              key={'author-' + index}
              className="bg-card hover:bg-accent flex items-start gap-x-4 rounded-lg p-4 shadow-2xl duration-75"
              href={`/author/${author.username}`}
            >
              <div className="flex space-x-4">
                <div className="relative aspect-square size-24 overflow-hidden rounded-full">
                  <Image
                    src={author?.avatar ?? 'images/profile-placeholder.png'}
                    fill
                    alt={author.username}
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-xs sm:text-sm">{author.fullname}</p>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                    @{author.username}
                  </p>
                  <p className="text-muted-foreground mb-2 text-xs sm:text-sm">
                    {author.bio}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {author.totalPosts} posts
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center pt-48 pb-64">
          <p className="text-center text-xl text-balance md:text-3xl">
            🙁 No Tags
          </p>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default AutoLoad;
