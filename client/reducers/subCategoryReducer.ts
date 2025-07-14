'use client';
import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import {
  ReduxErrorPayload,
  ReduxSuccessPayload,
  SubCategory,
} from '@/types/types';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface SubCategoryStateValues {
  loading: boolean;
  errors?: any[];
  current?: SubCategory;
  subcategories?: SubCategory[];
}

const initialState: SubCategoryStateValues = {
  loading: false,
  subcategories: [],
};

export const createSubCategory = createAsyncThunk<
  ReduxSuccessPayload,
  { name: string; summary?: string; category: string },
  { rejectValue: ReduxErrorPayload }
>('subcategory/create', async (data, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/sub-categories`;
    const response = await axios.post(url, data, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const updateSubCategory = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string; name: string; summary?: string; category: string },
  { rejectValue: ReduxErrorPayload }
>('subcategory/update', async (data, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/sub-categories/${data.id}`;
    const { id, ...payload } = data;
    const response = await axios.put(url, payload, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const fetchSubCategories = createAsyncThunk<
  ReduxSuccessPayload,
  { categorySlug: string },
  { rejectValue: ReduxErrorPayload }
>(
  'subcategory/fetchAll',
  async (data: { categorySlug: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/subcategory/${data.categorySlug}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const fetchSingleSubCategory = createAsyncThunk<
  ReduxSuccessPayload,
  string,
  { rejectValue: ReduxErrorPayload }
>('subcategory/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/sub-categories/${id}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const deleteSubCategory = createAsyncThunk<
  ReduxSuccessPayload,
  { id: string },
  { rejectValue: ReduxErrorPayload }
>('subcategory/delete', async (data: { id: string }, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/sub-categories/${data.id}`;
    const response = await axios.delete(url, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

const subCategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {
    resetSubCategoryState: (state: SubCategoryStateValues) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        fireToast('success', action.payload.message);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })

      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        fireToast('success', action.payload.message);
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })

      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload.data;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        fireToast('error', error.message);
      })

      .addCase(fetchSingleSubCategory.pending, (state) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(fetchSingleSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(fetchSingleSubCategory.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        fireToast('error', error.message);
      })

      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        fireToast('success', action.payload.message);
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        fireToast('error', error.message);
      });
  },
});

export const { resetSubCategoryState } = subCategorySlice.actions;
export const selectSubCategoryState = (state: RootState) => state.subCategory;
export default subCategorySlice.reducer;
