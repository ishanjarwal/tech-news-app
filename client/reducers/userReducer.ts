'use client';
import {
  changePasswordAPI,
  loginUserAPI,
  logoutUserAPI,
  registerUserAPI,
  resendOTPAPI,
  resetPasswordAPI,
  resetPasswordLinkAPI,
  updateUserAPI,
  userProfileAPI,
  verifyUserAPI,
} from '@/apis/userAPI';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import { User } from '@/types/types';
import fireToast from '@/utils/fireToast';
import { UserLoginValues, UserSignUpValues } from '@/validations/auth';
import { UpdateUserValues } from '@/validations/profile';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { string } from 'zod';

interface UserStateValues {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  errors?: any[];
  verification_email?: string;
  redirect?: string;
}

const initialState: UserStateValues = {
  user: null,
  loading: false,
  initialized: false,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: UserSignUpValues, { rejectWithValue }) => {
    try {
      const response = await registerUserAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const verifyUser = createAsyncThunk(
  'user/verify',
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await verifyUserAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const resendOTP = createAsyncThunk(
  'user/resent-otp',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await resendOTPAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: UserLoginValues, { rejectWithValue }) => {
    try {
      const response = await loginUserAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const userProfile = createAsyncThunk(
  'user/user-profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userProfileAPI();
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout-user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUserAPI();
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/change-password',
  async (
    data: {
      old_password: string;
      password: string;
      password_confirmation: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await changePasswordAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const resetPasswordLink = createAsyncThunk(
  'user/reset-password-link',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordLinkAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/reset-password',
  async (
    data: { token: string; password: string; password_confirmation: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPasswordAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update-user',
  async (data: UpdateUserValues, { rejectWithValue }) => {
    try {
      const response = await updateUserAPI(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state, action) {
      state.user = null;
    },
    resetVerificationEmail(state) {
      state.verification_email = undefined;
    },
    resetValidationErrors(state) {
      state.errors = undefined;
    },
    resetRedirect(state) {
      state.redirect = undefined;
    },
    setAvatar(state, action:PayloadAction<string | undefined>){
      if(state.user){
        state.user.avatar = action.payload
      }
    },
    setCoverImage(state, action:PayloadAction<string | undefined>){
      if(state.user){
        state.user.cover_image = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: any) => {
        console.log(action.payload);
        const { email } = action.payload?.data;
        const message = action.payload.message || 'Registered successfully';
        state.loading = false;
        state.verification_email = email;
        fireToast('success', message, 5000);
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        const error = action.payload;
        console.log(error);
        if (error?.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message || 'Something went wrong');
      })
      .addCase(verifyUser.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.initialized = false;
        const message = action.payload?.message || 'Verification successful';
        fireToast('success', message, 5000);
      })
      .addCase(verifyUser.rejected, (state, action: any) => {
        state.loading = false;
        const message = action.payload?.message || 'Something went wrong';
        fireToast('error', message, 3000);
      })
      .addCase(resendOTP.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state, action: any) => {
        const message = action.payload?.message || 'OTP Resent';
        state.loading = false;
        fireToast('success', message, 5000);
      })
      .addCase(resendOTP.rejected, (state, action: any) => {
        const message = action.payload?.message || 'Something went wrong';
        state.loading = false;
        fireToast('error', message, 5000);
      })
      .addCase(loginUser.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: any) => {
        const message = action.payload?.message || 'Logged in';
        state.loading = false;
        state.initialized = false;
        fireToast('success', message, 5000);
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        const message = action.payload?.message || 'Something went wrong';
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(userProfile.pending, (state, action: any) => {
        state.loading = true;
        state.initialized = false;
      })
      .addCase(userProfile.fulfilled, (state, action: any) => {
        const {
          fullname,
          email,
          username,
          roles,
          login_provider,
          avatar,
          cover_image,
          preferences,
          created_at,
          updated_at,
          socialLinks,
        } = action.payload?.data as User;
        state.loading = false;
        state.initialized = true;
        state.user = {
          email,
          username,
          fullname,
          login_provider,
          roles,
          avatar,
          created_at,
          updated_at,
          preferences,
          socialLinks,
          cover_image
        };
      })
      .addCase(userProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action: any) => {
        const message = action.payload?.message || 'Logged out';
        state.loading = false;
        state.user = null;
        fireToast('success', message, 3000);
      })
      .addCase(logoutUser.rejected, (state, action: any) => {
        const message = action.payload?.message || 'Something went wrong';
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(changePassword.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(resetPasswordLink.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(resetPasswordLink.fulfilled, (state, action: any) => {
        const message =
          action.payload?.message || 'Password reset link sent to your email';
        state.loading = false;
        state.redirect = '/';
        fireToast('success', message, 5000);
      })
      .addCase(resetPasswordLink.rejected, (state, action: any) => {
        const message = action.payload?.message || 'Something went wrong';
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(resetPassword.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action: any) => {
        const message = action.payload?.message || 'Password reset successful';
        state.loading = false;
        state.redirect = '/login';
        fireToast('success', message, 5000);
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        const message = action.payload?.message || 'Something went wrong';
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(updateUser.pending, (state, action: any) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.initialized = false;
        const message = action.payload?.message || 'Details updated';
        fireToast('success', message, 3000);
      })
      .addCase(updateUser.rejected, (state, action: any) => {
        state.loading = false;
        const status = action.payload?.status || 'error';
        if (status === 'validation_error') {
          state.errors = action.payload?.error;
        }
        const message = action.payload?.message || 'Something went wrong';
        fireToast('error', message, 3000);
      });
  },
});

export const {
  logout,
  resetVerificationEmail,
  resetValidationErrors,
  resetRedirect,
  setAvatar,
  setCoverImage
} = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
