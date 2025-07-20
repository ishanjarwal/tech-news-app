import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import {
  PublicUser,
  ReduxErrorPayload,
  ReduxSuccessPayload,
} from '@/types/types';
import fireToast from '@/utils/fireToast';
import { mapPublicUser } from '@/utils/mappers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface FollowStateValues {
  loading: boolean;
  follows: boolean; // to indicate if the user follows the current author
  followers?: PublicUser[];
  following: PublicUser[];
  page: number;
  fetchedTillNow: number;
  totalCount: number;
  limit: number;
}

const initialState: FollowStateValues = {
  loading: false,
  follows: false,
  following: [],
  page: 1,
  fetchedTillNow: 0,
  totalCount: 0,
  limit: 10,
};

export const fetchFollowing = createAsyncThunk<
  ReduxSuccessPayload,
  { page?: number },
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
  { page?: number },
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

export const followStatus = createAsyncThunk<
  ReduxSuccessPayload,
  { author_id: string },
  { rejectValue: ReduxErrorPayload }
>(
  'follow/follow-status',
  async (data: { author_id: string }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${env.NEXT_PUBLIC_BASE_URL}/follow/follow-status/${data.author_id}`
      );
      const response = await axios.get(url.toString(), {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

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

        const payload = action.payload;
        const limit = payload.data?.limit || 10;
        const page = payload.data?.page || 1;
        const totalCount = payload.data?.totalCount || 0;

        const fetchedUsers = (payload.data?.following || []).map(mapPublicUser);

        const existingFollowList = state.following ?? [];
        const updatedFollowList = [...existingFollowList, ...fetchedUsers];

        state.following = updatedFollowList;
        state.fetchedTillNow = existingFollowList.length + fetchedUsers.length;
        state.page = page;
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

        const payload = action.payload;
        const limit = payload.data?.limit || 10;
        const page = payload.data?.page || 1;
        const totalCount = payload.data?.totalCount || 0;

        const fetchedUsers = (payload.data?.followers || []).map(mapPublicUser);

        const existingFollowList = state.followers ?? [];
        const updatedFollowList = [...existingFollowList, ...fetchedUsers];

        state.followers = updatedFollowList;
        state.fetchedTillNow = existingFollowList.length + fetchedUsers.length;
        state.page = page;
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
          state.follows = false;
          const newFollowing = state.following.filter(
            (el) => el.username !== username
          );
          state.following = newFollowing;
          state.fetchedTillNow -= 1;
        } else {
          state.follows = true;
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
      })
      .addCase(followStatus.pending, (state, action) => {
        state.loading = true;
        state.follows = false;
      })
      .addCase(followStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.follows = action.payload.data?.follows ?? false;
      })
      .addCase(followStatus.rejected, (state, action) => {
        state.loading = false;
        state.follows = false;
      });
  },
});

export const selectFollowState = (state: RootState) => state.follow;
export default followSlice.reducer;

export const { resetFollowState } = followSlice.actions;
