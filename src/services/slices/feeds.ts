import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';

type TFeedState = {
  data: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  isLoadingCurrentOrder: boolean;
  currentOrderError: string | null;
};

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', getFeedsApi);

export const fetchOrderByNumber = createAsyncThunk(
  'feeds/getOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

const initialState: TFeedState = {
  data: null,
  isLoading: false,
  error: null,
  currentOrder: null,
  isLoadingCurrentOrder: false,
  currentOrderError: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.data?.orders,
    getFeed: (state) => state.data,
    getCurrentOrder: (state) => state.currentOrder
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
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.isLoadingCurrentOrder = true;
      state.currentOrderError = null;
      state.currentOrder = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      state.isLoadingCurrentOrder = false;
      state.currentOrder = action.payload.orders[0];
    });
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
      state.isLoadingCurrentOrder = false;
      state.currentOrderError = action.error.message || 'Failed to fetch feeds';
    });
  }
});

export const feedReducer = feedSlice.reducer;

export const { getOrders, getFeed, getCurrentOrder } = feedSlice.selectors;
