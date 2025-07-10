import { RootState } from '@/stores/appstore';
import { Category, Post, PublicUser, SubCategory } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

interface PostStateValues {
  loading: boolean;
  current?: Post;
  posts?: Post[];
  errors?: any[];
}

const initialState = {
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const selectPostState = (state: RootState) => state.post;
export default postSlice.reducer;
