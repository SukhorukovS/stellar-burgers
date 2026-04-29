import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

type TFeedState = {
  data: {
    orders: TOrder[];
    total: number;
    totalToday: number;
    success: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async () => await getFeedsApi()
);

const initialState: TFeedState = {
  data: null,
  isLoading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchFeeds.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch feeds';
    });
  }
});
