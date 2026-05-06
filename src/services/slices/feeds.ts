import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';

type TFeedState = {
  data: TOrdersData | null;
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
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.data?.orders,
    getFeed: (state) => state.data
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.data = null;
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

export const feedReducer = feedSlice.reducer;

export const { getOrders, getFeed } = feedSlice.selectors;

export const getOrderByNumber = (number: string | undefined) =>
  createSelector([getOrders], (orders) =>
    number
      ? orders?.find((order) => order.number === Number(number))
      : undefined
  );
