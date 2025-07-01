'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/reducers/userReducer';

export const appstore = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof appstore.getState>;
export type AppDispatch = typeof appstore.dispatch;
