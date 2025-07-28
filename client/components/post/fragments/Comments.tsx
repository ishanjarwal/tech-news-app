'use client';

import { CustomTextboxInput } from '@/components/common/CustomFormElements';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn, formatNumberShort } from '@/lib/utils';
import {
  createComment,
  deleteComment,
  editComment,
  fetchComments,
  replyComment,
  resetCommentErrors,
  resetDeleteCommentId,
  resetEditCommentId,
  resetReplyParentCommentId,
  selectCommentState,
  setDeleteCommentId,
  setEditCommentId,
  setReplyParentCommentId,
} from '@/reducers/commentReducer';
import { selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { getTransformedCloudinaryUrl } from '@/utils/getTransformedCloudinaryUrl';
import { commentSchema, CommentValues } from '@/validations/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const Comments = ({
  id,
  comments_count,
}: {
  id: string;
  comments_count: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments } = useSelector(selectCommentState);

  const [totalComments, setTotalComments] = useState<number>(comments_count);

  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchComments({ post_id: id }));
  }, []);

  return (
    <div className="mt-16" id="comments">
      <EditCommentDialog />
      <ReplyDialog post_id={id} setTotalComments={setTotalComments} />
      <DeleteCommentDialog setTotalComments={setTotalComments} />
      <h2 className="pb-2 text-3xl font-semibold">
        Comments ({formatNumberShort(totalComments)})
      </h2>
      <hr />
      <CommentForm id={id} setTotalComments={setTotalComments} />
      <div
        className={cn(
          showAll
            ? 'h-auto overflow-auto'
            : 'relative max-h-[400px] overflow-hidden'
        )}
      >
        {comments && comments.length > 0 ? (
          comments.map((comment: any, index: number) => (
            <div>
              <CommentItem
                id={comment.id}
                user={comment.user}
                content={comment.content}
                created_at={comment.created_at}
              />
              {comment.replies && comment.replies.length > 0 && (
                <div className="ps-8">
                  {comment.replies.map((reply: any, index: number) => (
                    <CommentItem
                      isReply={true}
                      id={reply.id}
                      user={reply.user}
                      content={reply.content}
                      created_at={reply.created_at}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="border-border mt-4 flex items-center justify-center rounded-lg border py-16">
            No Comments yet
          </div>
        )}
        <div
          className={cn(
            'flex items-end justify-center',
            showAll
              ? 'static py-2'
              : 'from-background absolute bottom-0 left-0 z-[1] h-48 w-full bg-gradient-to-t to-transparent'
          )}
        >
          <Button
            onClick={() => {
              setShowAll((prev) => !prev);
            }}
            variant={'outline'}
            size={'sm'}
            className="cursor-pointer rounded-full text-xs"
          >
            {!showAll ? 'Show All' : 'Hide'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({
  isReply = false,
  id,
  user,
  content,
  created_at,
}: {
  isReply?: boolean;
  id: string;
  user: { username: string; fullname: string; avatar?: string };
  content: string;
  created_at: Date;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { user: me } = useSelector(selectUserState);

  return (
    <div className="flex items-start space-x-4 py-4">
      <div>
        <Image
          src={
            user.avatar
              ? getTransformedCloudinaryUrl(user.avatar, {
                  quality: 'auto:eco',
                  width: 96,
                  height: 96,
                  crop: 'fill',
                })
              : '/images/profile-placeholder.png'
          }
          width={120}
          height={120}
          className="size-8 rounded-full object-cover object-center sm:size-12"
          alt={user.fullname}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-semibold">{user.fullname}</p>
          <p className="text-muted-foreground text-xs">
            {formatDistanceToNow(created_at)}
          </p>
        </div>
        <p>{content}</p>
        {me && (
          <div className="mt-1 flex items-center justify-start space-x-1">
            {!isReply && (
              <button
                onClick={() => dispatch(setReplyParentCommentId(id))}
                className="text-muted-foreground hover:text-foreground cursor-pointer bg-transparent text-xs"
              >
                Reply
              </button>
            )}
            {user.username === me?.username && (
              <button
                onClick={() => dispatch(setDeleteCommentId(id))}
                className="text-muted-foreground hover:text-foreground cursor-pointer bg-transparent text-xs"
              >
                Remove
              </button>
            )}
            {user.username === me?.username && (
              <button
                onClick={() =>
                  dispatch(
                    setEditCommentId({ id: id, defaultContent: content })
                  )
                }
                className="text-muted-foreground hover:text-foreground cursor-pointer bg-transparent text-xs"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentForm = ({
  id,
  setTotalComments,
}: {
  id: string;
  setTotalComments: Dispatch<SetStateAction<number>>;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, errors: validation_errors } =
    useSelector(selectCommentState);

  const { user } = useSelector(selectUserState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentValues>({
    defaultValues: { content: '' },
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentValues) => {
    const result = await dispatch(
      createComment({ content: data.content, post_id: id })
    );
    if (createComment.fulfilled.match(result)) {
      setTotalComments((prev: number) => prev + 1);
      reset();
    }
  };

  if (!user) return null;

  return (
    <form className="pt-8 pb-4" onSubmit={handleSubmit(onSubmit)}>
      {/* <h2 className="mb-8 text-2xl font-semibold">Add a comment</h2> */}
      {validation_errors && (
        <div className="border-destructive bg-destructive/10 text-destructive mb-8 w-full rounded-lg px-3 py-2">
          {validation_errors.map((el) => (
            <p className="flex items-start justify-start space-x-1">
              <X size={16} className="mt-[3px]" />
              <span>{el.msg}</span>
            </p>
          ))}
        </div>
      )}
      <CustomTextboxInput
        register={register}
        labelText="Your comment here"
        name="content"
        error={errors.content}
      />
      <Button className="mt-4 w-full cursor-pointer">Submit</Button>
    </form>
  );
};

const ReplyDialog = ({
  post_id,
  setTotalComments,
}: {
  post_id: string;
  setTotalComments: Dispatch<SetStateAction<number>>;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    errors: validation_errors,
    replyParentCommentId,
  } = useSelector(selectCommentState);

  const { user } = useSelector(selectUserState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentValues>({
    defaultValues: { content: '' },
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentValues) => {
    if (!replyParentCommentId) return;
    const result = await dispatch(
      replyComment({
        content: data.content,
        post_id,
        comment_id: replyParentCommentId,
      })
    );
    if (replyComment.fulfilled.match(result)) {
      reset();
      dispatch(resetReplyParentCommentId());
      setTotalComments((prev) => prev + 1);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      open={replyParentCommentId ? true : false}
      onOpenChange={(value: boolean) => {
        dispatch(resetCommentErrors());
        if (!value) {
          reset();
          dispatch(resetReplyParentCommentId());
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-start">Reply</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {validation_errors && (
              <div className="border-destructive bg-destructive/10 text-destructive mb-8 w-full rounded-lg px-3 py-2">
                {validation_errors.map((el) => (
                  <p className="flex items-start justify-start space-x-1">
                    <X size={16} className="mt-[3px]" />
                    <span>{el.msg}</span>
                  </p>
                ))}
              </div>
            )}
            <div className="mt-4">
              <CustomTextboxInput
                labelText="Your Reply"
                register={register}
                name="content"
                disabled={loading}
                error={errors.content}
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button
                className="cursor-pointer"
                type="button"
                variant={'destructive'}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button className="cursor-pointer" type="submit">
              Reply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteCommentDialog = ({
  setTotalComments,
}: {
  setTotalComments: Dispatch<SetStateAction<number>>;
}) => {
  const { loading, deleteCommentId } = useSelector(selectCommentState);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    if (!deleteCommentId) return;
    const result = await dispatch(
      deleteComment({ comment_id: deleteCommentId })
    );
    if (deleteComment.fulfilled.match(result)) {
      const totalDeleted = result.payload.data.totalDeleted;
      dispatch(resetDeleteCommentId());
      setTotalComments((prev) => prev - totalDeleted);
    }
  };

  return (
    <Dialog
      open={deleteCommentId ? true : false}
      onOpenChange={(value: boolean) => {
        if (!value) {
          dispatch(resetDeleteCommentId());
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your comment</DialogTitle>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={loading} variant={'destructive'}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={loading} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditCommentDialog = () => {
  const {
    loading,
    editCommentId,
    errors: validation_errors,
  } = useSelector(selectCommentState);
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector(selectUserState);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<CommentValues>({
    defaultValues: { content: '' },
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentValues) => {
    if (!editCommentId) return;
    const result = await dispatch(
      editComment({ comment_id: editCommentId.id, content: data.content })
    );
    if (editComment.fulfilled.match(result)) {
      dispatch(resetEditCommentId());
    }
  };

  useEffect(() => {
    if (editCommentId) {
      setValue('content', editCommentId.defaultContent);
    }
  }, [editCommentId]);

  if (!user) return null;

  return (
    <Dialog
      open={editCommentId ? true : false}
      onOpenChange={(value: boolean) => {
        if (!value) {
          dispatch(resetEditCommentId());
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {validation_errors && (
              <div className="border-destructive bg-destructive/10 text-destructive mb-8 w-full rounded-lg px-3 py-2">
                {validation_errors.map((el) => (
                  <p className="flex items-start justify-start space-x-1">
                    <X size={16} className="mt-[3px]" />
                    <span>{el.msg}</span>
                  </p>
                ))}
              </div>
            )}
            <div className="mt-4">
              <CustomTextboxInput
                labelText="Your comment"
                register={register}
                name="content"
                disabled={loading}
                error={errors.content}
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button
                disabled={loading}
                className="cursor-pointer"
                type="button"
                variant={'destructive'}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                loading || editCommentId?.defaultContent === watch('content')
              }
              className="cursor-pointer"
              type="submit"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Comments;
