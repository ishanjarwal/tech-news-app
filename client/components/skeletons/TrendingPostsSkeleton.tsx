import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const TrendingPostsSkeleton = () => {
  return (
    <div>
      <h2 className="border-foreground flex w-full items-center space-x-2 border-b-2 pb-2 text-2xl font-semibold uppercase">
        <TrendingUp className="text-green-500" />
        <span>Trending</span>
      </h2>
      <div className="mt-4 flex flex-col space-y-8">
        {Array.from({ length: 4 }).map((_: any, index: number) => {
          return (
            <div key={'trending-post-' + index} className="flex space-x-4">
              <div className="relative aspect-square size-24 overflow-hidden rounded-lg">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="flex flex-1 flex-col space-y-4">
                <Skeleton className="h-2 w-[20%] rounded-sm" />
                <Skeleton className="h-2 w-full rounded-sm" />
                <Skeleton className="h-2 w-[85%] rounded-sm" />
                <Skeleton className="h-2 w-[30%] rounded-sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingPostsSkeleton;
