import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import { ReduxErrorPayload, ReduxSuccessPayload } from '@/types/types';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface LikedPost {
  id: string;
  title: string;
  summary: string;
  thumbnail?: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

interface PostLiker {
  id: string;
  fullname: string;
  username: string;
  avatar: string;
}

interface LikeStateValues {
  loading: boolean;
  likedPosts?: LikedPost[];
  postLikers?: PostLiker[];
  liked: boolean;
}

const initialState: LikeStateValues = {
  loading: false,
  liked: false,
};

export const togglePostLike = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'like/toggle-post-like',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/like/toggle/${data.id}`;
      const response = await axios.get(url, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const likedStatus = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'like/post-like-status',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/like/status/${data.id}`;
      const response = await axios.get(url, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(togglePostLike.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data.liked) {
          state.liked = true;
        } else {
          state.liked = false;
        }
        const message = payload.message;
        fireToast('success', message);
      })
      .addCase(togglePostLike.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as ReduxErrorPayload;
        const message = payload.message;
        fireToast('error', message);
      })
      .addCase(likedStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(likedStatus.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data.liked) {
          state.liked = true;
        } else {
          state.liked = false;
        }
      })
      .addCase(likedStatus.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as ReduxErrorPayload;
        const message = payload.message;
        fireToast('error', message);
      });
  },
});

export const selectLikeState = (state: RootState) => state.like;
export default likeSlice.reducer;
