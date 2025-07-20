import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function getRandomPixelLengths(
  count = 20,
  min = 64,
  max = 120
): string[] {
  const lengths: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    lengths.push(`${randomValue}px`);
  }

  return lengths;
}

const PopularTagsSkeleton = () => {
  const lengths = getRandomPixelLengths();

  return (
    <div>
      <h2 className="border-foreground border-b-2 pb-2 text-2xl font-semibold uppercase">
        🔥 Popular Topics
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {lengths.map((len: string, index: number) => {
          return (
            <Skeleton
              key={'popular-tag-' + index}
              className="h-9 rounded-md"
              style={{ width: len }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PopularTagsSkeleton;
