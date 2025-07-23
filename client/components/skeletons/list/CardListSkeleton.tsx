import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const CardListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_: any, index: number) => (
        <Skeleton key={index} className="aspect-[16/9] rounded-lg" />
      ))}
    </div>
  );
};

export default CardListSkeleton;
