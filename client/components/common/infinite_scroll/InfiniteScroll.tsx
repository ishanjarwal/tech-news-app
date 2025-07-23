'use client';

import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React from 'react';
import ReactInfiniteScroll from 'react-infinite-scroll-component';

interface InfiniteScrollProps {
  children: React.ReactNode;
  page: number;
  total: number;
  totalPages: number;
  height?: number;
  className?: string;
  action: (...props: any[]) => void;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  page,
  total,
  totalPages,
  height = 400,
  className,
  action,
}) => {
  const hasMore = page < totalPages;

  return (
    <div
      id="scrollableDiv"
      className={cn('overflow-auto p-2 sm:rounded-md sm:border', className)}
      // style={{ height }}
    >
      <ReactInfiniteScroll
        dataLength={total} // otal items currently rendered
        next={action} // your redux dispatch here
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            <Loader className="text-muted-foreground h-5 w-5 animate-spin" />
          </div>
        }
        // scrollableTarget="scrollableDiv"
      >
        {children}
      </ReactInfiniteScroll>
    </div>
  );
};

export default InfiniteScroll;
