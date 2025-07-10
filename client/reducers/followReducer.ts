import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import { ReduxErrorPayload, ReduxSuccessPayload } from '@/types/types';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface Follow {
  id: string;
  fullname: string;
  email: string;
  username: string;
  avatar?: string;
}

interface FollowStateValues {
  loading: boolean;
  followers?: Follow[];
  following: Follow[];
  page: number;
  fetchedTillNow: number;
  totalCount: number;
  limit: number;
}

const initialState: FollowStateValues = {
  loading: false,
  following: [],
  page: 1,
  fetchedTillNow: 0,
  totalCount: 0,
  limit: 10,
};

export const fetchFollowing = createAsyncThunk<
  ReduxSuccessPayload,
  {},
  { rejectValue: ReduxErrorPayload }
>('follow/following', async (data: { page?: number }, { rejectWithValue }) => {
  try {
    const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/follow`);
    if (data.page) {
      url.searchParams.append('page', String(data.page));
    }
    const response = await axios.get(url.toString(), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const fetchFollowers = createAsyncThunk<
  ReduxSuccessPayload,
  {},
  { rejectValue: ReduxErrorPayload }
>('follow/followers', async (data: { page?: number }, { rejectWithValue }) => {
  try {
    const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/follow/followers`);
    if (data.page) {
      url.searchParams.append('page', String(data.page));
    }
    const response = await axios.get(url.toString(), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const toggleFollow = createAsyncThunk<
  ReduxSuccessPayload,
  { username: string },
  { rejectValue: ReduxErrorPayload }
>('follow/toggle', async (data: { username: string }, { rejectWithValue }) => {
  try {
    const url = new URL(`${env.NEXT_PUBLIC_BASE_URL}/follow/${data.username}`);
    const response = await axios.post(
      url.toString(),
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const removeFollow = createAsyncThunk<
  ReduxSuccessPayload,
  { username: string },
  { rejectValue: ReduxErrorPayload }
>('follow/remove', async (data: { username: string }, { rejectWithValue }) => {
  try {
    const url = new URL(
      `${env.NEXT_PUBLIC_BASE_URL}/follow/remove/${data.username}`
    );
    const response = await axios.get(url.toString(), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    resetFollowState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowing.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        const limit = action.payload?.data?.limit || 10;
        const page = action.payload?.data?.page || 1;
        const following = action.payload?.data?.following || [];
        const fetchedTillNow = (page - 1) * limit + following.length;
        const newFollowList = [...state.following, ...following];
        const totalCount = action.payload?.data?.totalCount || 0;
        state.following = newFollowList;
        state.page = action.payload?.data?.page || 1;
        state.fetchedTillNow = fetchedTillNow;
        state.totalCount = totalCount;
        state.limit = limit;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || 'Something went wrong';
        fireToast('error', message, 2000);
      })
      .addCase(fetchFollowers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        const limit = action.payload?.data?.limit || 10;
        const page = action.payload?.data?.page || 1;
        const followers = action.payload?.data?.followers || [];
        const fetchedTillNow = (page - 1) * limit + followers.length;
        const newFollowList = [...state.following, ...followers];
        const totalCount = action.payload?.data?.totalCount || 0;
        state.followers = newFollowList;
        state.page = action.payload?.data?.page || 1;
        state.fetchedTillNow = fetchedTillNow;
        state.totalCount = totalCount;
        state.limit = limit;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || 'Something went wrong';
        fireToast('error', message, 2000);
      })
      .addCase(toggleFollow.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.loading = false;
        const intent = action.payload?.data?.action;
        const username = action.payload?.data?.username;
        if (intent === 'unfollow') {
          const newFollowing = state.following.filter(
            (el) => el.username !== username
          );
          state.following = newFollowing;
          state.fetchedTillNow -= 1;
        }
        const message = action.payload?.message;
        fireToast('success', message, 1500);
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || 'Something went wrong';
        fireToast('error', message, 2000);
      })
      .addCase(removeFollow.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(removeFollow.fulfilled, (state, action) => {
        const { username } = action.meta.arg;
        state.loading = false;
        const newFollowers = state.followers?.filter(
          (el) => el.username !== username
        );
        state.followers = newFollowers;
        state.fetchedTillNow -= 1;
        const message = action.payload.message;
        fireToast('success', message, 1500);
      })
      .addCase(removeFollow.rejected, (state, action) => {
        state.loading = false;
        const message =
          (action.payload as ReduxErrorPayload).message ||
          'Something went wrong';
        fireToast('error', message, 2000);
      });
  },
});

export const selectFollowState = (state: RootState) => state.follow;
export default followSlice.reducer;

export const { resetFollowState } = followSlice.actions;
