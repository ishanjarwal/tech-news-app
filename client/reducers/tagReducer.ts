'use client';
import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import {
  Category,
  ReduxErrorPayload,
  ReduxSuccessPayload,
  Tag,
} from '@/types/types';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface TagStateValues {
  loading: boolean;
  errors?: any[];
  current?: Tag;
  tags?: Tag[];
}

const initialState: TagStateValues = {
  loading: false,
};

export const createTag = createAsyncThunk<
  ReduxSuccessPayload,
  { name: string; summary: string },
  { rejectValue: ReduxErrorPayload }
>(
  'tag/create',
  async (data: { name: string; summary: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/tag`;
      const response = await axios.post(url, data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const searchTags = createAsyncThunk<
  ReduxSuccessPayload,
  { q: string },
  { rejectValue: ReduxErrorPayload }
>('tag/search', async (data: { q: string }, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/tag/search/${data.q}`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    resetValidationErrors(state) {
      state.errors = undefined;
    },
    resetTags(state) {
      state.tags = undefined;
    },
    resetTag(state) {
      state.current = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTag.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        const message = action.payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
      })
      .addCase(createTag.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(searchTags.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
        state.tags = undefined;
      })
      .addCase(searchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data;
      })
      .addCase(searchTags.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        fireToast('error', error.message);
      });
  },
});

export const { resetValidationErrors, resetTags } = tagSlice.actions;
export const selectTagState = (state: RootState) => state.tag;

export default tagSlice.reducer;
