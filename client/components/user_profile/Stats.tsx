'use client';
import { env } from '@/config/env';
import { formatNumberShort } from '@/lib/utils';
import { selectUserState } from '@/reducers/userReducer';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  const fetchStats = async (username: string) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/author/${username}`;
      const response = await axios.get(url);
      const data = {
        posts: response.data.data.totalPosts,
        followers: response.data.data.totalLikes,
        likes: response.data.data.totalFollowers,
      };
      setStats(data);
    } catch (error) {
      return redirect('/error');
    }
  };

  useEffect(() => {
    console.log(user.username);
    fetchStats(user.username);
  }, []);

  return (
    <div className="">
      <div className="bg-muted flex items-center justify-evenly py-2 sm:rounded-2xl">
        {stats &&
          Object.keys(stats).map((key) => (
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
