import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TagListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-2 pb-8 sm:gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 20 }).map((_, index: number) => (
        <Skeleton key={'tagskeleton-' + index} className="h-24 rounded-lg" />
      ))}
    </div>
  );
};

export default TagListSkeleton;
