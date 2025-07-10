'use client';
import InfiniteScroll from '@/components/common/infinite_scroll/InfiniteScroll';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  fetchFollowers,
  fetchFollowing,
  removeFollow,
  resetFollowState,
  selectFollowState,
} from '@/reducers/followReducer';
import { AppDispatch } from '@/stores/appstore';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchFollowers({ page: 1 }));
      hasFetched.current = true;
    }
  }, []);

  const { followers, page, loading, fetchedTillNow, totalCount, limit } =
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
          dispatch(fetchFollowers({ page: page + 1 }));
        }}
        page={page}
        totalPages={Math.ceil(totalCount / limit)}
        total={fetchedTillNow}
      >
        {followers && followers.length > 0 ? (
          followers.map((el, index) => (
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
                  onClick={() => {
                    dispatch(removeFollow({ username: el.username }));
                  }}
                  className="cursor-pointer hover:brightness-75"
                  variant={'secondary'}
                  size={'sm'}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-center text-sm">
              No one follows you
            </p>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default page;
