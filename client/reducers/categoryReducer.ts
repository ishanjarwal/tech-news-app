'use client';
import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import {
  Category,
  ReduxErrorPayload,
  ReduxSuccessPayload,
} from '@/types/types';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface CategoryStateValues {
  initialized: boolean;
  loading: boolean;
  errors?: any[];
  current?: Category;
  categories?: Category[];
}

const initialState: CategoryStateValues = {
  initialized: false,
  loading: false,
};

export const createCateogory = createAsyncThunk<
  ReduxSuccessPayload,
  { name: string; summary: string },
  { rejectValue: ReduxErrorPayload }
>(
  'category/create',
  async (data: { name: string; summary: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/category`;
      const response = await axios.post(url, data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const fetchCategories = createAsyncThunk<
  ReduxSuccessPayload,
  void,
  { rejectValue: ReduxErrorPayload }
>('category/fetch', async (_, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/category`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const fetchCategory = createAsyncThunk<
  ReduxSuccessPayload,
  { slug: string },
  { rejectValue: ReduxErrorPayload }
>(
  'category/fetch-single',
  async (data: { slug: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/category/${data.slug}`;
      const response = await axios.get(url, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const updateCategory = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string; name?: string; summary?: string },
  { rejectValue: ReduxErrorPayload }
>(
  'category/update',
  async (
    data: { id: string; name?: string; summary?: string },
    { rejectWithValue }
  ) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/category/${data.id}`;
      const response = await axios.put(url, data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const deleteCategory = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string },
  { rejectValue: ReduxErrorPayload }
>('category/delete', async (data: { id: string }, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/category/${data.id}`;
    const response = await axios.delete(url, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

// TODO : Thumbnail upload and delete

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    resetValidationErrors(state) {
      state.errors = undefined;
    },
    resetCategories(state) {
      state.categories = undefined;
    },
    resetCategory(state) {
      state.current = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCateogory.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(createCateogory.fulfilled, (state, action) => {
        const message = action.payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
      })
      .addCase(createCateogory.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(fetchCategories.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const categories = action.payload.data.categories.map((el: any) => ({
          id: el._id,
          name: el.name,
          slug: el.slug,
          summary: el.summary,
          created_at: el.created_at,
          updated_at: el.updated_at,
          thumbnail: el.thumbnail,
        }));
        state.categories = categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ReduxErrorPayload;
        fireToast('error', error.message);
      })
      .addCase(fetchCategory.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ReduxErrorPayload;
        fireToast('error', error.message);
      })
      .addCase(updateCategory.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload.message;
        fireToast('success', message);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ReduxErrorPayload;
        fireToast('error', error.message);
      });
  },
});

export const { resetValidationErrors } = categorySlice.actions;
export const selectCategoryState = (state: RootState) => state.cateogory;

export default categorySlice.reducer;
