import { configureStore } from '@reduxjs/toolkit';
import {
  fetchUser,
  registerUser,
  loginUser,
  fetchUserOrders,
  updateUser,
  logoutUser,
  userReducer,
  getUser,
  getError,
  getIsLoading,
  getIsInitialState,
  getOrders,
  getIsOrdersLoading,
  getOrdersError
} from './user';
import { describe, it, expect, beforeEach } from '@jest/globals';

const initialState = {
  user: null,
  isInitialState: true,
  isLoading: false,
  error: null as string | null,
  orders: null,
  isOrdersLoading: false,
  ordersError: null as string | null
};

const mockUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockUserResponse = {
  success: true,
  user: mockUser
};

const mockOrders = [
  {
    _id: 'order-1',
    ingredients: ['ingredient-1', 'ingredient-2'],
    status: 'done',
    name: 'Burger 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1
  },
  {
    _id: 'order-2',
    ingredients: ['ingredient-3', 'ingredient-4'],
    status: 'pending',
    name: 'Burger 2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    number: 2
  }
];

describe('async actions', () => {
  test('get user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUserResponse),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(fetchUser());

    const { user, isInitialState } = store.getState().user;
    expect(user).toEqual(mockUser);
    expect(isInitialState).toBe(false);
  });

  test('register user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUserResponse),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(
      registerUser({ email: 'test@example.com', name: 'Test', password: '123' })
    );

    const { user } = store.getState().user;
    expect(user).toEqual(mockUser);
  });

  test('enter user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUserResponse),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(
      loginUser({ email: 'test@example.com', password: '123' })
    );

    const { user } = store.getState().user;
    expect(user).toEqual(mockUser);
  });

  test('get user orders', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, orders: mockOrders }),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(fetchUserOrders());

    const { orders, isOrdersLoading } = store.getState().user;
    expect(orders).toEqual(mockOrders);
    expect(isOrdersLoading).toBe(false);
  });

  test('update user', async () => {
    const updatedUser = { email: 'new@example.com', name: 'New User' };
    const updatedResponse = { success: true, user: updatedUser };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(updatedResponse),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(updateUser({ name: 'New User' }));

    const { user } = store.getState().user;
    expect(user).toEqual(updatedUser);
  });

  test('logout user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          ...initialState,
          user: mockUser
        }
      }
    });

    await store.dispatch(logoutUser());

    const { user } = store.getState().user;
    expect(user).toBeNull();
  });

  test('handle error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('Network error')),
        ok: false
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(fetchUser());

    const { error, isLoading, isInitialState } = store.getState().user;
    expect(isLoading).toBe(false);
    expect(isInitialState).toBe(false);
    expect(error).not.toBeNull();
  });
});

describe('userSlice selectors', () => {
  beforeEach(() => {
    initialState.user = null;
    initialState.isInitialState = true;
    initialState.isLoading = false;
    initialState.error = null;
    initialState.orders = null;
    initialState.isOrdersLoading = false;
    initialState.ordersError = null;
  });

  describe('slice selectors', () => {
    it('should return user', () => {
      const state = {
        user: {
          ...initialState,
          user: mockUser
        }
      };

      const user = getUser(state);
      expect(user).toEqual(mockUser);
    });

    it('should return error', () => {
      const state = {
        user: {
          ...initialState,
          error: 'Test error'
        }
      };

      const error = getError(state);
      expect(error).toBe('Test error');
    });

    it('should return loading state', () => {
      const state = {
        user: {
          ...initialState,
          isLoading: true
        }
      };

      const isLoading = getIsLoading(state);
      expect(isLoading).toBe(true);
    });

    it('should return initial state flag', () => {
      const state = {
        user: {
          ...initialState,
          isInitialState: true
        }
      };

      const isInitialState = getIsInitialState(state);
      expect(isInitialState).toBe(true);
    });

    it('should return orders', () => {
      const state = {
        user: {
          ...initialState,
          orders: mockOrders
        }
      };

      const orders = getOrders(state);
      expect(orders).toEqual(mockOrders);
    });

    it('should return orders loading state', () => {
      const state = {
        user: {
          ...initialState,
          isOrdersLoading: true
        }
      };

      const isOrdersLoading = getIsOrdersLoading(state);
      expect(isOrdersLoading).toBe(true);
    });

    it('should return orders error', () => {
      const state = {
        user: {
          ...initialState,
          ordersError: 'Orders error'
        }
      };

      const ordersError = getOrdersError(state);
      expect(ordersError).toBe('Orders error');
    });
  });
});
