'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/reducers/userReducer';
import photoReducer from '@/reducers/photoReducer';
export const appstore = configureStore({
  reducer: {
    user: userReducer,
    photo: photoReducer,
  },
});

export type RootState = ReturnType<typeof appstore.getState>;
export type AppDispatch = typeof appstore.dispatch;
