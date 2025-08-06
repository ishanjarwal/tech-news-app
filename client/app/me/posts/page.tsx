'use client';
import Tooltip from '@/components/common/Tooltip';
import { Button } from '@/components/ui/button';
import {
  changePostStatus,
  deletePost,
  fetchAuthorPosts,
  resetDeletePostId,
  resetPostState,
  selectPostState,
  setDeletePostId,
} from '@/reducers/postReducer';
import { AppDispatch } from '@/stores/appstore';
import { Delete, Loader, Pen, Save, Trash, Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import InfiniteScroll from '@/components/common/infinite_scroll/InfiniteScroll';
import Link from 'next/link';
import Masonry from '@/components/masonry/Masonry';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const page = () => {
  const { posts, loading, fetchedTillNow, totalCount, page, limit } =
    useSelector(selectPostState);
  const dispatch = useDispatch<AppDispatch>();

  const hasFetched = useRef(false);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const fetchFirstPosts = async () => {
    const result = await dispatch(fetchAuthorPosts({ page: 1 }));
    if (fetchAuthorPosts.fulfilled.match(result)) {
      setFirstLoad(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchFirstPosts();
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
      <DeleteDialog />
      <InfiniteScroll
        action={handleNext}
        // height={400}
        totalPages={Math.ceil(totalCount / limit)}
        total={fetchedTillNow}
        page={page}
      >
        <div>
          {firstLoad ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="animate-spin" />
            </div>
          ) : posts && posts.length > 0 ? (
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
                              onClick={() => {
                                dispatch(setDeletePostId(el.id));
                              }}
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

const DeleteDialog = () => {
  const { loading, deletePostId } = useSelector(selectPostState);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    if (!deletePostId) return;
    const result = await dispatch(deletePost({ id: deletePostId }));
    if (deletePost.fulfilled.match(result)) {
      dispatch(resetDeletePostId());
    }
  };

  return (
    <Dialog
      open={deletePostId ? true : false}
      onOpenChange={(value: boolean) => {
        if (!value) {
          dispatch(resetDeletePostId());
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure ?</DialogTitle>
          <p>
            This action can't be undone. This will delete you post including all
            the data like images, comments etc.
          </p>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={loading} variant={'secondary'}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            onClick={handleDelete}
            variant={'destructive'}
          >
            {!loading ? 'Delete' : <Loader className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default page;
