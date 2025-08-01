'use client';
import Tooltip from '@/components/common/Tooltip';
import { Button } from '@/components/ui/button';
import { formatNumberShort } from '@/lib/utils';
import {
  likedStatus,
  selectLikeState,
  togglePostLike,
} from '@/reducers/likeReducer';
import { selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LikeButton = ({
  id,
  author_username,
  like_count,
}: {
  id: string;
  author_username: string;
  like_count: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectUserState);
  const { loading, liked } = useSelector(selectLikeState);
  const [totalLikes, setTotalLikes] = useState<number>(like_count);

  const toggleLike = async () => {
    if (!user) return;
    const result = await dispatch(togglePostLike({ id }));
    if (togglePostLike.fulfilled.match(result)) {
      const liked = result.payload.data.liked;
      if (liked) {
        setTotalLikes((prev) => prev + 1);
      } else {
        setTotalLikes((prev) => prev - 1);
      }
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(likedStatus({ id }));
    }
  }, [user]);

  return (
    <Tooltip content={liked ? 'Unlike this post' : 'Like this post'}>
      <Button
        onClick={toggleLike}
        disabled={loading}
        variant={'ghost'}
        className="cursor-pointer flex-col gap-0 px-2"
      >
        <span>{liked ? LikedHeart : <Heart />}</span>
        <span className="text-[8px] sm:!text-[10px]">
          {formatNumberShort(totalLikes)}
        </span>
      </Button>
    </Tooltip>
  );
};

const LikedHeart = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-heart-icon lucide-heart"
  >
    <path
      fill="red"
      color="red"
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    />
  </svg>
);

export default LikeButton;
