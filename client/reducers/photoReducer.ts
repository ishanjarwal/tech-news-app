'use client';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setAvatar, setCoverImage } from './userReducer';
import axios from 'axios';
import { env } from '@/config/env';
import { ReduxErrorPayload, ReduxSuccessPayload } from '@/types/types';

interface PhotoStateValues {
  open: boolean;
  title: string;
  description: string;
  loading: boolean;
  errors?: any[];
  action: ((photo?: Blob) => void) | null;
  aspectRatio: number;
}

const initialState: PhotoStateValues = {
  open: false,
  title: '',
  description: '',
  loading: false,
  errors: undefined,
  action: null,
  aspectRatio: 1,
};

export const uploadProfilePicture = createAsyncThunk<
  ReduxSuccessPayload,
  { photo: Blob },
  { rejectValue: ReduxErrorPayload }
>(
  'photo/upload-profile-picture',
  async (data: { photo: Blob }, { rejectWithValue, dispatch }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/upload-profile-picture`;
      const formData = new FormData();
      formData.append('image', data.photo);
      const response = await axios.post(url, formData, {
        withCredentials: true,
      });
      dispatch(setAvatar(response.data.avatar));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const deleteProfilePicture = createAsyncThunk<
  ReduxSuccessPayload,
  any,
  { rejectValue: ReduxErrorPayload }
>('photo/delete-profile-picture', async (_, { dispatch, rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/profile-picture`;
    const response = await axios.delete(url, { withCredentials: true });
    dispatch(setAvatar());
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const uploadCoverImage = createAsyncThunk<
  ReduxSuccessPayload,
  { photo: Blob },
  { rejectValue: ReduxErrorPayload }
>(
  'photo/upload-cover-image',
  async (data: { photo: Blob }, { rejectWithValue, dispatch }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/upload-cover-image`;
      const formData = new FormData();
      formData.append('image', data.photo);
      const response = await axios.post(url, formData, {
        withCredentials: true,
      });
      dispatch(setCoverImage(response.data.data.cover_image));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const deleteCoverImage = createAsyncThunk<
  ReduxSuccessPayload,
  any,
  { rejectValue: ReduxErrorPayload }
>('photo/delete-cover-image', async (_, { dispatch, rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/cover-image`;
    const response = await axios.delete(url, { withCredentials: true });
    dispatch(setCoverImage());
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    open(state, action) {
      state.title = action.payload?.title || 'Upload a picture';
      state.description = action.payload?.description;
      state.aspectRatio = action.payload?.aspectRatio || 1;
      state.action = action.payload?.action || null;
      state.open = true;
    },
    close(state) {
      state.open = false;
      state.title = '';
      state.description = '';
      state.aspectRatio = 1;
      state.action = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.open = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(deleteProfilePicture.pending, (state) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(deleteProfilePicture.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false;
      })
      .addCase(deleteProfilePicture.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.open = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(uploadCoverImage.pending, (state) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false;
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.open = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(deleteCoverImage.pending, (state) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(deleteCoverImage.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false;
      })
      .addCase(deleteCoverImage.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.open = false;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      });
  },
});

export const { open, close } = photoSlice.actions;
export const selectPhotoState = (state: RootState) => state.photo;

export default photoSlice.reducer;
