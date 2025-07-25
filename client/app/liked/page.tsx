'use client';

import MinimalCard from '@/components/post_card/MinimalCard';
import {
  fetchLikedPosts,
  LikedPost,
  selectLikeState,
} from '@/reducers/likeReducer';
import { AppDispatch } from '@/stores/appstore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, likedPosts } = useSelector(selectLikeState);

  useEffect(() => {
    dispatch(fetchLikedPosts());
  }, []);

  return (
    <div className="pb-8">
      <h2 className="my-8 text-2xl font-semibold md:text-3xl">
        ❤️ Liked Posts
      </h2>

      {likedPosts && likedPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {likedPosts.map((post: LikedPost, index: number) => (
            <MinimalCard post={post} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border px-4 py-16">
          <p className="text-center text-balance">You haven't liked anything</p>
        </div>
      )}
    </div>
  );
};

export default page;
