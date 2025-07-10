import { RootState } from '@/stores/appstore';
import { Comment } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

interface CommentStateValues {
  loading: boolean;
  comments?: Comment[];
}

const initialState: CommentStateValues = {
  loading: false,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const selectCommentState = (state: RootState) => state.comment;
export default commentSlice.reducer;
