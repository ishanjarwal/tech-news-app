'use client';
import Tooltip from '@/components/common/Tooltip';
import { Button } from '@/components/ui/button';
import {
  changePostStatus,
  fetchAuthorPosts,
  resetPostState,
  selectPostState,
} from '@/reducers/postReducer';
import { AppDispatch } from '@/stores/appstore';
import { Loader, Pen, Save, Trash, Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import InfiniteScroll from '@/components/common/infinite_scroll/InfiniteScroll';
import Link from 'next/link';
import Masonry from '@/components/masonry/Masonry';

const page = () => {
  const { posts, loading, fetchedTillNow, totalCount, page, limit } =
    useSelector(selectPostState);
  const dispatch = useDispatch<AppDispatch>();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchAuthorPosts({ page: 1 }));
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetPostState());
    };
  }, []);

  const handleNext = () => {
    dispatch(fetchAuthorPosts({ page: page + 1 }));
  };

  const draftPost = (id: string) => {
    dispatch(changePostStatus({ id, status: 'draft' }));
  };

  return (
    <div>
      <InfiniteScroll
        action={handleNext}
        // height={400}
        totalPages={Math.ceil(totalCount / limit)}
        total={fetchedTillNow}
        page={page}
      >
        <div>
          {posts && posts.length > 0 ? (
            <div>
              <Masonry gutters={{ 0: '8px' }}>
                {posts.map((el) => (
                  <div className="bg-foreground/10 w-full break-inside-avoid p-2 sm:rounded-lg">
                    {el?.thumbnail && (
                      <Link
                        href={'/post/' + el.slug}
                        className="relative block aspect-[16/9] w-full overflow-hidden rounded-md"
                      >
                        <Image
                          fill
                          className="absolute h-full w-full object-cover object-center"
                          src={el.thumbnail}
                          alt="postname"
                        />
                      </Link>
                    )}
                    <div className="flex flex-col space-y-2 pt-2">
                      <Link href={'/post/' + el.slug}>
                        <h3 className="line-clamp-2 overflow-hidden text-lg font-semibold text-balance text-ellipsis sm:text-xl">
                          {el.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          Updated{' '}
                          {formatDistanceToNow(el.updated_at, {
                            addSuffix: true,
                          })}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Tooltip content="Draft this post">
                            <Button
                              onClick={() => draftPost(el.id)}
                              variant={'link'}
                              size={'icon'}
                              className="size-6 cursor-pointer !rounded-[4px] hover:brightness-90 sm:size-8"
                            >
                              <Save />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Edit this post">
                            <Button
                              variant={'link'}
                              size={'icon'}
                              className="size-6 cursor-pointer !rounded-[4px] hover:brightness-90 sm:size-8"
                              asChild
                            >
                              <Link href={`/edit/${el.id}`}>
                                <Pen />
                              </Link>
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete this post">
                            <Button
                              size={'icon'}
                              className="text-destructive size-6 cursor-pointer !rounded-[4px] hover:brightness-90 sm:size-8"
                              variant={'link'}
                            >
                              <Trash />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>
          ) : (
            <div className="col-span-3 flex items-center justify-center">
              <p className="text-muted-foreground text-center text-sm">
                No Posts
              </p>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default page;
