'use client';

import axios from 'axios';
import { Loader } from 'lucide-react';
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
  const [tags, setTags] = useState<any[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [scrollThreshold, setScrollThreshold] = useState<string>('');

  const fetchNext = async () => {
    const nextPage = page + 1;
    const url = new URL(initialUrl);
    url.searchParams.append('page', String(nextPage));
    const res = await axios.get(url.toString());
    const newTags = res.data?.data.tags;

    if (!newTags || newTags.length === 0) {
      setHasMore(false);
    } else {
      setTags((prev) => [...prev, ...newTags]);
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
      dataLength={tags.length}
      next={fetchNext}
      hasMore={hasMore}
      loader={
        <p className="mx-auto flex items-center justify-center py-4">
          <Loader className="animate-spin" />
        </p>
      }
      // endMessage={<p className="mt-4 text-center">No more tags</p>}
    >
      {initialData.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 pb-8 sm:gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {initialData.map((tag: any, index: number) => (
            <Link
              key={'tag-' + index}
              className="bg-card hover:bg-accent flex items-start gap-x-4 rounded-lg p-4 shadow-2xl duration-75"
              href={`/tag/${tag.slug}`}
            >
              <div className="flex flex-1 flex-col">
                <p className="mb-2 text-lg leading-tight font-semibold sm:text-xl">
                  #{tag.slug}
                </p>
                <p className="text-xs sm:text-sm">{tag.name}</p>
                <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                  {tag.summary}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {tag.totalPosts} posts
                </p>
              </div>
            </Link>
          ))}
          {tags.map((tag: any, index: number) => (
            <Link
              key={'tag-' + index}
              className="bg-card hover:bg-accent flex items-start gap-x-4 rounded-lg p-4 shadow-2xl duration-75"
              href={`/tag/${tag.slug}`}
            >
              <div className="flex flex-1 flex-col">
                <p className="mb-2 text-lg leading-tight font-semibold sm:text-xl">
                  #{tag.slug}
                </p>
                <p className="text-xs sm:text-sm">{tag.name}</p>
                <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                  {tag.summary}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {tag.totalPosts} posts
                </p>
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
