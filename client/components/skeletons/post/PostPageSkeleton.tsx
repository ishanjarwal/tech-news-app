import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const PostPageSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-6 gap-y-24 px-2 py-4 sm:px-4 sm:py-16 md:py-24 lg:gap-x-32 lg:gap-y-0">
        <div className="col-span-6 lg:col-span-4">
          <div>
            <Skeleton className="mb-4 h-4 w-[75%]" />
            <Skeleton className="mb-4 h-4 w-[50%]" />
            <div className="mb-4 flex max-w-lg items-center justify-evenly space-x-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="mb-8 aspect-video w-full" />
            <div className="flex flex-col space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[50%]" />
            </div>
          </div>
        </div>
        <div className="col-span-6 flex flex-col space-y-16 lg:col-span-2">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
        </div>
      </div>
    </div>
  );
};

export default PostPageSkeleton;
