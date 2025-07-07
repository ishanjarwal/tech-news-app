'use client';
import { deleteCoverImageAPI, deleteProfilePictureAPI, uploadCoverImageAPI, uploadProfilePictureAPI } from '@/apis/photoAPI';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import fireToast from '@/utils/fireToast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setAvatar, setCoverImage } from './userReducer';

interface PhotoStateValues {
  open: boolean;
  title: string;
  description: string;
  loading: boolean;
  errors?: any[];
  action: ((photo?: Blob) => void )| null;
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

export const uploadProfilePicture = createAsyncThunk(
  'photo/upload-profile-picture',
  async (data: {photo: Blob}, { rejectWithValue, dispatch }) => {
    try {
      const response = await uploadProfilePictureAPI(data.photo);
      dispatch(setAvatar(response.data.avatar))
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const deleteProfilePicture = createAsyncThunk(
  'photo/delete-profile-picture',
  async (_, { dispatch,rejectWithValue }) => {
    try {
      const response = await deleteProfilePictureAPI();
      dispatch(setAvatar())
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);


export const uploadCoverImage = createAsyncThunk(
  'photo/upload-cover-image',
  async (data: {photo: Blob}, { rejectWithValue, dispatch }) => {
    try {
      const response = await uploadCoverImageAPI(data.photo);
      dispatch(setCoverImage(response.data.cover_image))
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const deleteCoverImage = createAsyncThunk(
  'photo/delete-cover-image',
  async (_, { dispatch,rejectWithValue }) => {
    try {
      const response = await deleteCoverImageAPI();
      dispatch(setCoverImage())
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    open(state, action) {
      state.title = action.payload?.title || 'Upload a picture';
      state.description = action.payload?.description;
      state.aspectRatio = action.payload?.aspectRatio || 1;
      state.action = action.payload?.action || null
      state.open = true;
    },
    close(state) {
      state.open = false;
      state.title = '';
      state.description = '';
      state.aspectRatio = 1;
      state.action = null
    },
  },
  extraReducers: (builder) => {
      builder
      .addCase(uploadProfilePicture.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action: any) => {
        const message = action.payload.message || 'Profile updated';
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false
      })
      .addCase(uploadProfilePicture.rejected, (state, action: any) => {
        state.open = false
        const error = action.payload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message || 'Something went wrong');
      })
      .addCase(deleteProfilePicture.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(deleteProfilePicture.fulfilled, (state, action: any) => {
        const message = action.payload.message || 'Profile removed';
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false
      })
      .addCase(deleteProfilePicture.rejected, (state, action: any) => {
        state.open = false
        const error = action.payload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message || 'Something went wrong');
      }).addCase(uploadCoverImage.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action: any) => {
        const message = action.payload.message || 'Cover image updated';
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false
      })
      .addCase(uploadCoverImage.rejected, (state, action: any) => {
        state.open = false
        const error = action.payload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message || 'Something went wrong');
      })
      .addCase(deleteCoverImage.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(deleteCoverImage.fulfilled, (state, action: any) => {
        const message = action.payload.message || 'Cover Image removed';
        state.loading = false;
        fireToast('success', message, 5000);
        state.open = false
      })
      .addCase(deleteCoverImage.rejected, (state, action: any) => {
        state.open = false
        const error = action.payload;
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message || 'Something went wrong');
      })


  },
});

export const { open, close } = photoSlice.actions;
export const selectPhotoState = (state: RootState) => state.photo;

export default photoSlice.reducer;
