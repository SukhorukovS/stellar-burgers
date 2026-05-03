import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => await getUserApi()
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => await loginUserApi(data)
);

const initialState: TUserState = {
  isLoading: false,
  error: null,
  user: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    getUser: (state) => state.user,
    getError: (state) => state.error,
    getIsLoading: (state) => state.isLoading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.user = payload.user;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch user';
    });
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.user = payload.user;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to register user';
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.user = payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to login user';
    });
  }
});

export const userReducer = userSlice.reducer;

export const { getUser, getError, getIsLoading } = userSlice.selectors;
