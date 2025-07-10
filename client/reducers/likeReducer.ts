import { RootState } from '@/stores/appstore';
import { createSlice } from '@reduxjs/toolkit';

interface LikedPost {
  id: string;
  title: string;
  summary: string;
  thumbnail?: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

interface PostLiker {
  id: string;
  fullname: string;
  username: string;
  avatar: string;
}

interface LikeStateValues {
  loading: boolean;
  likedPosts?: LikedPost[];
  postLikers?: PostLiker[];
}

const initialState: LikeStateValues = {
  loading: false,
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const selectLikeState = (state: RootState) => state.like;
export default likeSlice.reducer;
