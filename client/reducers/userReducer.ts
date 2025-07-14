'use client';
import { env } from '@/config/env';
import { reduxThunkErrorPaylod } from '@/lib/utils';
import { RootState } from '@/stores/appstore';
import { ReduxErrorPayload, ReduxSuccessPayload, User } from '@/types/types';
import fireToast from '@/utils/fireToast';
import { UserLoginValues, UserSignUpValues } from '@/validations/auth';
import { UpdateUserValues } from '@/validations/profile';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const registerUser = createAsyncThunk<
  ReduxSuccessPayload,
  UserSignUpValues,
  { rejectValue: ReduxErrorPayload }
>('user/register', async (data: UserSignUpValues, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user`;
    const { fullname, email, password, username } = data;
    const response = await axios.post(url, {
      fullname,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const verifyUser = createAsyncThunk<
  ReduxSuccessPayload,
  { email: string; otp: string },
  { rejectValue: ReduxErrorPayload }
>(
  'user/verify',
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/verify-account`;
      const response = await axios.post(url, data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const resendOTP = createAsyncThunk<
  ReduxSuccessPayload,
  { email: string },
  { rejectValue: ReduxErrorPayload }
>('user/resent-otp', async (data: { email: string }, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/resend-otp`;
    const response = await axios.post(url, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const loginUser = createAsyncThunk<
  ReduxSuccessPayload,
  UserLoginValues,
  { rejectValue: ReduxErrorPayload }
>('user/login', async (data: UserLoginValues, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/login`;
    const response = await axios.post(url, data, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const userProfile = createAsyncThunk<
  ReduxSuccessPayload,
  void,
  { rejectValue: ReduxErrorPayload }
>('user/user-profile', async (_, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/me`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const logoutUser = createAsyncThunk<
  ReduxSuccessPayload,
  void,
  { rejectValue: ReduxErrorPayload }
>('user/logout-user', async (_, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/logout`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

export const changePassword = createAsyncThunk<
  ReduxSuccessPayload,
  { old_password: string; password: string; password_confirmation: string },
  { rejectValue: ReduxErrorPayload }
>(
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
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/change-password`;
      const response = await axios.post(url, data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const resetPasswordLink = createAsyncThunk<
  ReduxSuccessPayload,
  { email: string },
  { rejectValue: ReduxErrorPayload }
>(
  'user/reset-password-link',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/forgot-password`;
      const response = await axios.post(url, data, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const resetPassword = createAsyncThunk<
  ReduxSuccessPayload,
  { token: string; password: string; password_confirmation: string },
  { rejectValue: ReduxErrorPayload }
>(
  'user/reset-password',
  async (
    data: { token: string; password: string; password_confirmation: string },
    { rejectWithValue }
  ) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/reset-password/${data.token}`;
      const response = await axios.post(
        url,
        {
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(reduxThunkErrorPaylod(error));
    }
  }
);

export const updateUser = createAsyncThunk<
  ReduxSuccessPayload,
  UpdateUserValues,
  { rejectValue: ReduxErrorPayload }
>('user/update-user', async (data: UpdateUserValues, { rejectWithValue }) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/`;
    const formattedData = {
      ...data,
      websites: data.websites?.map((el) => el.value),
    };
    const response = await axios.put(url, formattedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(reduxThunkErrorPaylod(error));
  }
});

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
    setAvatar(state, action: PayloadAction<string | undefined>) {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    setCoverImage(state, action: PayloadAction<string | undefined>) {
      if (state.user) {
        state.user.cover_image = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.errors = undefined;
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const payload = action.payload;
        const { email } = payload.data;
        const message = payload.message;
        state.loading = false;
        state.verification_email = email;
        fireToast('success', message, 5000);
      })
      .addCase(registerUser.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        if (error.status === 'validation_error') {
          state.errors = error.error;
        }
        state.loading = false;
        fireToast('error', error.message);
      })
      .addCase(verifyUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.initialized = false;
        const message = payload.message;
        fireToast('success', message, 5000);
      })
      .addCase(verifyUser.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        const message = error.message;
        fireToast('error', message, 3000);
      })
      .addCase(resendOTP.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message, 5000);
      })
      .addCase(resendOTP.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        const message = error.message;
        state.loading = false;
        fireToast('error', message, 5000);
      })
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        state.initialized = false;
        fireToast('success', message, 5000);
      })
      .addCase(loginUser.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        const message = error.message;
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(userProfile.pending, (state, action) => {
        state.loading = true;
        state.initialized = false;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        const payload = action.payload;
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
        } = payload.data;
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
          cover_image,
        };
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action: any) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        state.user = null;
        fireToast('success', message, 3000);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        const message = error.message;
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        fireToast('success', message);
      })
      .addCase(changePassword.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        const message = error.message;
        fireToast('error', message);
      })
      .addCase(resetPasswordLink.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resetPasswordLink.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        state.redirect = '/';
        fireToast('success', message, 5000);
      })
      .addCase(resetPasswordLink.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        const message = error.message;
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        const payload = action.payload;
        const message = payload.message;
        state.loading = false;
        state.redirect = '/login';
        fireToast('success', message, 5000);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        const message = action.payload?.message || 'Something went wrong';
        state.loading = false;
        fireToast('error', message, 3000);
      })
      .addCase(updateUser.pending, (state, action) => {
        state.loading = true;
        state.errors = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.initialized = false;
        const message = payload.message;
        fireToast('success', message, 3000);
      })
      .addCase(updateUser.rejected, (state, action) => {
        const error = action.payload as ReduxErrorPayload;
        state.loading = false;
        const status = error.status;
        if (status === 'validation_error') {
          state.errors = error.error;
        }
        const message = error.message;
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
  setCoverImage,
} = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
