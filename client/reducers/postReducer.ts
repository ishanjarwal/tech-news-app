import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import { Post, ReduxErrorPayload, ReduxSuccessPayload } from '@/types/types';
import fireToast from '@/utils/fireToast';
import { mapPost } from '@/utils/mappers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface PostStateValues {
  loading: boolean;
  current?: Post;
  posts?: Post[];
  errors?: any[];
  page: number;
  fetchedTillNow: number;
  totalCount: number;
  limit: number;
}

const initialState: PostStateValues = {
  loading: false,
  fetchedTillNow: 0,
  limit: 10,
  page: 1,
  totalCount: 0,
};

export const createPost = createAsyncThunk<
  ReduxSuccessPayload,
  {
    title: string;
    summary: string;
    content: string;
    category: string;
    subCategory?: string;
    tags: string[];
  },
  { rejectValue: ReduxErrorPayload }
>(
  'post/create',
  async (
    data: {
      title: string;
      summary: string;
      content: string;
      category: string;
      subCategory?: string;
      tags: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/post`;
      const response = await axios.post(url, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const fetchAuthorPosts = createAsyncThunk<
  ReduxSuccessPayload,
  { status?: 'draft'; page?: number } | void,
  { rejectValue: ReduxErrorPayload }
>(
  'post/get-author-posts',
  async (
    data: { status?: 'draft'; page?: number } | void,
    { rejectWithValue }
  ) => {
    try {
      const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/post/myposts`);
      if (data?.page) {
        url.searchParams.append('page', String(data.page));
      }
      if (data?.status) {
        url.searchParams.append('status', 'draft');
      }
      const response = await axios.get(url.toString(), {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const changePostStatus = createAsyncThunk<
  ReduxSuccessPayload,
  { status: 'draft' | 'published'; id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'post/change-post-status',
  async (
    data: { status: 'draft' | 'published'; id: string },
    { rejectWithValue }
  ) => {
    try {
      const url = new URL(
        `${env.NEXT_PUBLIC_BASE_URL}/post/change-status/${data.id}`
      );
      const response = await axios.patch(
        url.toString(),
        { status: data.status },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const uploadThumbnailTemp = createAsyncThunk<
  ReduxSuccessPayload,
  { photo: Blob },
  { rejectValue: ReduxErrorPayload }
>('post/thumbnail-temp', async (data: { photo: Blob }, { rejectWithValue }) => {
  try {
    const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/post/thumbnail-temp/`);
    const formData = new FormData();
    formData.append('image', data.photo);
    const response = await axios.post(url.toString(), formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const updatePost = createAsyncThunk<
  ReduxSuccessPayload,
  {
    id: string;
    title?: string;
    summary?: string;
    content?: string;
    category?: string;
    subCategory?: string;
    tags?: string[];
  },
  { rejectValue: ReduxErrorPayload }
>(
  'post/update-post',
  async (
    data: {
      id: string;
      title?: string;
      summary?: string;
      content?: string;
      category?: string;
      subCategory?: string;
      tags?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/post/${data.id}`);
      const response = await axios.put(
        url.toString(),
        { ...data, id: undefined },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const uploadThumbnail = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string; photo: Blob },
  { rejectValue: ReduxErrorPayload }
>(
  'post/upload_thumbnail',
  async (data: { photo: Blob; id: string }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${env.NEXT_PUBLIC_BASE_URL}/post/thumbnail/${data.id}`
      );
      const formData = new FormData();
      formData.append('image', data.photo);
      const response = await axios.post(url.toString(), formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const removeThumbnail = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'post/remove-thumbnail',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${env.NEXT_PUBLIC_BASE_URL}/post/thumbnail/${data.id}`
      );
      const response = await axios.delete(url.toString(), {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    resetPostState: (state: PostStateValues) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        const message = payload.message;
        fireToast('success', message);
      })
      .addCase(createPost.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(fetchAuthorPosts.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(fetchAuthorPosts.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;

        const limit = payload.data?.limit || 10;
        const page = payload.data?.page || 1;
        const totalCount = payload.data?.totalCount || 0;

        const newPosts = payload.data.posts.map((el: any) => mapPost(el));
        const existingPosts = state.posts ?? [];

        state.posts = [...existingPosts, ...newPosts];
        state.fetchedTillNow = existingPosts.length + newPosts.length;
        state.page = page;
        state.totalCount = totalCount;
        state.limit = limit;
      })
      .addCase(fetchAuthorPosts.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(changePostStatus.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(changePostStatus.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        const message = payload.message;
        fireToast('success', message);
        state.fetchedTillNow = state.fetchedTillNow - 1;
        state.posts = (state.posts ? state.posts : []).filter(
          (el) => el.slug !== payload.data.slug
        );
      })
      .addCase(changePostStatus.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(uploadThumbnailTemp.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(uploadThumbnailTemp.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        const message = payload.message;
        fireToast('success', message);
      })
      .addCase(uploadThumbnailTemp.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(updatePost.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        const message = payload.message;
        fireToast('success', message);
      })
      .addCase(updatePost.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(uploadThumbnail.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(uploadThumbnail.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        const message = payload.message;
        fireToast('success', message);
      })
      .addCase(uploadThumbnail.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(removeThumbnail.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(removeThumbnail.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        const message = payload.message;
        fireToast('success', message);
      })
      .addCase(removeThumbnail.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        const message = error.message;
        fireToast('error', message);
      });
  },
});

export const selectPostState = (state: RootState) => state.post;
export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
