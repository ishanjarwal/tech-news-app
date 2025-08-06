'use client';
import InfiniteScroll from '@/components/common/infinite_scroll/InfiniteScroll';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  fetchFollowing,
  resetFollowState,
  selectFollowState,
  toggleFollow,
} from '@/reducers/followReducer';
import { AppDispatch } from '@/stores/appstore';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
  const hasFetched = useRef(false);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const fetchFirstFollowing = async () => {
    const result = await dispatch(fetchFollowing({ page: 1 }));
    if (fetchFollowing.fulfilled.match(result)) {
      setFirstLoad(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchFirstFollowing();
      hasFetched.current = true;
    }
  }, []);

  const { following, page, loading, fetchedTillNow, totalCount, limit } =
    useSelector(selectFollowState);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      dispatch(resetFollowState());
    };
  }, []);

  return (
    <div>
      <InfiniteScroll
        height={400}
        action={() => {
          dispatch(fetchFollowing({ page: page + 1 }));
        }}
        page={page}
        totalPages={Math.ceil(totalCount / limit)}
        total={fetchedTillNow}
      >
        {firstLoad ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="animate-spin" />
          </div>
        ) : following.length > 0 ? (
          following.map((el, index) => (
            <div className="flex justify-between rounded-md px-4 py-4">
              <div className="flex items-center justify-start space-x-4">
                <div className="w-12 overflow-hidden rounded-full">
                  <AspectRatio ratio={1}>
                    <Image
                      src={el.avatar || '/images/profile-placeholder.png'}
                      fill
                      alt="follower profile"
                      className="h-full w-full object-cover object-center"
                    />
                  </AspectRatio>
                </div>
                <div>
                  <p className="text-sm">{el.fullname}</p>
                  <p className="text-muted-foreground text-xs">
                    @{el.username}
                  </p>
                </div>
              </div>
              <div>
                <Button
                  disabled={loading}
                  onClick={() => {
                    dispatch(toggleFollow({ username: el.username }));
                  }}
                  className="cursor-pointer hover:brightness-75"
                  variant={'secondary'}
                  size={'sm'}
                >
                  Unfollow
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground text-center text-sm">
              You follow no one
            </p>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default page;
