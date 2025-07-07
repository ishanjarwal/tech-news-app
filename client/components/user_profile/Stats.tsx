import { formatNumberShort } from '@/lib/utils';
import React from 'react';

const stats: Record<string, number> = {
  posts: 200,
  impressions: 1543,
  followers: 3243,
  likes: 3148233,
};

const Stats = () => {
  return (
    <div className="">
      <div className="bg-muted grid grid-cols-4 py-2 sm:rounded-2xl">
        {Object.keys(stats).map((key) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center px-4 py-2"
          >
            <p className="text-2xl font-semibold">
              {formatNumberShort(stats[key])}
            </p>
            <p className="text-xs capitalize">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
