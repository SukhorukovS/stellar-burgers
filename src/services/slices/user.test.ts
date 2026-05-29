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

describe('async actions reducers', () => {
  test('fetch user pending', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchUser/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.isInitialState).toBe(false);
    expect(state.error).toBeNull();
  });

  test('fetch user fulfilled', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchUser/fulfilled',
      payload: mockUserResponse
    });

    expect(state.isLoading).toBe(false);
    expect(state.isInitialState).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('fetch user rejected', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchUser/rejected',
      error: { message: 'Network error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.isInitialState).toBe(false);
    expect(state.error).toContain('Network error');
  });

  test('register user pending', () => {
    const state = userReducer(initialState, {
      type: 'user/registerUser/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('register user fulfilled', () => {
    const state = userReducer(initialState, {
      type: 'user/registerUser/fulfilled',
      payload: mockUserResponse
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('register user rejected', () => {
    const state = userReducer(initialState, {
      type: 'user/registerUser/rejected',
      error: { message: 'Registration failed' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Registration failed');
  });

  test('login user pending', () => {
    const state = userReducer(initialState, {
      type: 'user/loginUser/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('login user fulfilled', () => {
    const state = userReducer(initialState, {
      type: 'user/loginUser/fulfilled',
      payload: mockUserResponse
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('login user rejected', () => {
    const state = userReducer(initialState, {
      type: 'user/loginUser/rejected',
      error: { message: 'Login failed' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Login failed');
  });

  test('fetch user orders pending', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchUserOrders/pending'
    });

    expect(state.isOrdersLoading).toBe(true);
    expect(state.ordersError).toBeNull();
  });

  test('fetch user orders fulfilled', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchUserOrders/fulfilled',
      payload: mockOrders
    });

    expect(state.isOrdersLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.ordersError).toBeNull();
  });

  test('fetch user orders rejected', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchUserOrders/rejected',
      error: { message: 'Failed to fetch orders' }
    });

    expect(state.isOrdersLoading).toBe(false);
    expect(state.ordersError).toContain('Failed to fetch orders');
  });

  test('update user pending', () => {
    const state = userReducer(initialState, {
      type: 'user/updateUser/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('update user fulfilled', () => {
    const updatedUser = { email: 'new@example.com', name: 'New User' };
    const state = userReducer(initialState, {
      type: 'user/updateUser/fulfilled',
      payload: { success: true, user: updatedUser }
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(updatedUser);
    expect(state.error).toBeNull();
  });

  test('update user rejected', () => {
    const state = userReducer(initialState, {
      type: 'user/updateUser/rejected',
      error: { message: 'Update failed' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Update failed');
  });

  test('logout user pending', () => {
    const state = userReducer(initialState, {
      type: 'user/logoutUser/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('logout user fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser
    };
    const state = userReducer(stateWithUser, {
      type: 'user/logoutUser/fulfilled',
      payload: { success: true }
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  test('logout user rejected stores', () => {
    const state = userReducer(initialState, {
      type: 'user/logoutUser/rejected',
      error: { message: 'Logout failed' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Logout failed');
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
