'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/reducers/userReducer';
import photoReducer from '@/reducers/photoReducer';
import categoryReducer from '@/reducers/categoryReducer';
import subCategoryReducer from '@/reducers/subCategoryReducer';
import followReducer from '@/reducers/followReducer';
import likeReducer from '@/reducers/likeReducer';
import postReducer from '@/reducers/postReducer';
import commentReducer from '@/reducers/commentReducer';
import tagReducer from '@/reducers/tagReducer';

export const appstore = configureStore({
  reducer: {
    user: userReducer,
    photo: photoReducer,
    cateogory: categoryReducer,
    subCategory: subCategoryReducer,
    follow: followReducer,
    like: likeReducer,
    post: postReducer,
    comment: commentReducer,
    tag: tagReducer,
  },
});

export type RootState = ReturnType<typeof appstore.getState>;
export type AppDispatch = typeof appstore.dispatch;
