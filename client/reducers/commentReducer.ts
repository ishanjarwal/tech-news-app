import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import { Comment, ReduxErrorPayload, ReduxSuccessPayload } from '@/types/types';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface CommentStateValues {
  loading: boolean;
  comments?: Comment[];
  errors?: any[];
  replyParentCommentId?: string;
  deleteCommentId?: string;
}

const initialState: CommentStateValues = {
  loading: false,
};

export const createComment = createAsyncThunk<
  ReduxSuccessPayload,
  { post_id: string; content: string },
  { rejectValue: ReduxErrorPayload }
>(
  'comment/create-comment',
  async (data: { post_id: string; content: string }, { rejectWithValue }) => {
    try {
      const { post_id, content } = data;
      const url = `${env.NEXT_PUBLIC_BASE_URL}/comment/${post_id}`;
      const response = await axios.post(
        url,
        { content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const replyComment = createAsyncThunk<
  ReduxSuccessPayload,
  { content: string; post_id: string; comment_id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'comment/reply-comment',
  async (
    data: { content: string; post_id: string; comment_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { post_id, comment_id, content } = data;
      const url = `${env.NEXT_PUBLIC_BASE_URL}/comment/${comment_id}/${post_id}`;
      const response = await axios.post(
        url,
        { content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const fetchComments = createAsyncThunk<
  ReduxSuccessPayload,
  { post_id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'comment/fetch-comments',
  async (data: { post_id: string }, { rejectWithValue }) => {
    try {
      const { post_id } = data;
      const url = `${env.NEXT_PUBLIC_BASE_URL}/comment/${post_id}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const deleteComment = createAsyncThunk<
  ReduxSuccessPayload,
  { comment_id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'comment/delete-comment',
  async (data: { comment_id: string }, { rejectWithValue }) => {
    try {
      const { comment_id } = data;
      const url = `${env.NEXT_PUBLIC_BASE_URL}/comment/${comment_id}`;
      const response = await axios.delete(url, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    resetCommentErrors: (state) => {
      state.errors = undefined;
    },
    setReplyParentCommentId: (state, action: { payload: string }) => {
      state.replyParentCommentId = action.payload;
    },
    resetReplyParentCommentId: (state) => {
      state.replyParentCommentId = undefined;
    },
    setDeleteCommentId: (state, action: { payload: string }) => {
      state.deleteCommentId = action.payload;
    },
    resetDeleteCommentId: (state) => {
      state.deleteCommentId = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const message = payload.message;
        const comment: Comment = {
          id: payload.data._id,
          content: payload.data.content,
          created_at: payload.data.created_at,
          replies: [],
          user: {
            username: payload.data.user.username,
            fullname: payload.data.user.fullname,
            avatar: payload.data.user.avatar,
          },
        };
        const comments = state.comments ? state.comments : [];
        comments.unshift(comment);
        state.comments = comments;
        fireToast('success', message);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as ReduxErrorPayload;
        if (payload.status == 'validation_error') {
          state.errors = payload.error;
        }
        const message = payload.message;
        fireToast('error', message);
      })
      .addCase(replyComment.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(replyComment.fulfilled, (state, action) => {
        state.loading = false;
        const { message, data } = action.payload;
        const parent_id = data.parent_id;

        const reply: Comment = {
          id: data._id,
          content: data.content,
          created_at: data.created_at,
          replies: [],
          user: {
            username: data.user.username,
            fullname: data.user.fullname,
            avatar: data.user.avatar,
          },
        };

        const parentComment = state.comments?.find((c) => c.id === parent_id);

        if (parentComment) {
          parentComment.replies = [reply, ...parentComment.replies];
          fireToast('success', message);
        }
      })
      .addCase(replyComment.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as ReduxErrorPayload;
        if (payload.status == 'validation_error') {
          state.errors = payload.error;
        }
        const message = payload.message;
        fireToast('error', message);
      })
      .addCase(fetchComments.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data.comments) {
          const comments = payload.data.comments.map((comment: any) => ({
            id: comment._id,
            user: {
              username: comment.user.username,
              fullname: comment.user.fullname,
              avatar: comment.user?.avatar,
            },
            content: comment.content,
            created_at: comment.created_at,
            replies: comment.replies.map((reply: any) => ({
              id: reply._id,
              user: {
                username: reply.user.username,
                fullname: reply.user.fullname,
                avatar: reply.user?.avatar,
              },
              content: reply.content,
              created_at: reply.created_at,
            })),
          }));
          state.comments = comments;
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as ReduxErrorPayload;
        const message = payload.message;
        fireToast('error', message);
      })
      .addCase(deleteComment.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (!state.comments) return;

        state.loading = false;
        const { message, data } = action.payload;
        const comment_id = data.comment_id;
        const parent_comment_id = data.parent_comment_id ?? undefined;

        if (parent_comment_id) {
          // Delete a reply
          const parentComment = state.comments.find(
            (c) => c.id === parent_comment_id
          );
          if (parentComment) {
            parentComment.replies = parentComment.replies.filter(
              (reply) => reply.id !== comment_id
            );
          }
        } else {
          // Delete a top-level comment
          state.comments = state.comments.filter(
            (comment) => comment.id !== comment_id
          );
        }

        fireToast('success', message);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        const payload = action.payload as ReduxErrorPayload;
        state.loading = false;
        const message = payload.message;
        fireToast('error', message);
      });
  },
});

export const selectCommentState = (state: RootState) => state.comment;
export const {
  resetCommentErrors,
  resetReplyParentCommentId,
  setReplyParentCommentId,
  setDeleteCommentId,
  resetDeleteCommentId,
} = commentSlice.actions;
export default commentSlice.reducer;
