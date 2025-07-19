'use client';
import { formatNumberShort } from '@/lib/utils';
import { selectUserState } from '@/reducers/userReducer';
import React from 'react';
import { useSelector } from 'react-redux';

const stats: Record<string, number> = {
  posts: 200,
  impressions: 1543,
  followers: 3243,
  likes: 3148233,
};

const Stats = () => {
  const { user } = useSelector(selectUserState);
  if (!user?.roles.includes('author')) return null;
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
