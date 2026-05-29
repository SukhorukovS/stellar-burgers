import { configureStore } from '@reduxjs/toolkit';
import {
  fetchFeeds,
  fetchOrderByNumber,
  feedReducer,
  getOrders,
  getFeed,
  getCurrentOrder
} from './feeds';
import { describe, it, expect, beforeEach } from '@jest/globals';

const initialState = {
  data: null,
  isLoading: false,
  error: null as string | null,
  currentOrder: null,
  isLoadingCurrentOrder: false,
  currentOrderError: null as string | null
};

const mockOrderData = {
  orders: [
    {
      _id: 'order-1',
      ingredients: ['ingredient-1', 'ingredient-2'],
      status: 'done' as const,
      name: 'Burger 1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 1
    },
    {
      _id: 'order-2',
      ingredients: ['ingredient-3', 'ingredient-4'],
      status: 'pending' as const,
      name: 'Burger 2',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      number: 2
    }
  ],
  total: 100,
  totalToday: 10
};

const mockCurrentOrder = {
  _id: 'order-1',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done' as const,
  name: 'Burger 1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 1
};

describe('async actions reducers', () => {
  test('fetch feeds pending', () => {
    const state = feedReducer(initialState, {
      type: 'feeds/fetchFeeds/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.data).toBeNull();
  });

  test('fetch feeds fulfilled', () => {
    const state = feedReducer(initialState, {
      type: 'feeds/fetchFeeds/fulfilled',
      payload: mockOrderData
    });

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockOrderData);
    expect(state.error).toBeNull();
  });

  test('fetch feeds rejected', () => {
    const state = feedReducer(initialState, {
      type: 'feeds/fetchFeeds/rejected',
      error: { message: 'Network error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Network error');
  });

  test('fetch order by number pending', () => {
    const state = feedReducer(initialState, {
      type: 'feeds/getOrderByNumber/pending'
    });

    expect(state.isLoadingCurrentOrder).toBe(true);
    expect(state.currentOrderError).toBeNull();
    expect(state.currentOrder).toBeNull();
  });

  test('fetch order by number fulfilled', () => {
    const state = feedReducer(initialState, {
      type: 'feeds/getOrderByNumber/fulfilled',
      payload: { orders: [mockCurrentOrder] }
    });

    expect(state.isLoadingCurrentOrder).toBe(false);
    expect(state.currentOrder).toEqual(mockCurrentOrder);
    expect(state.currentOrderError).toBeNull();
  });

  test('fetch order by number rejected', () => {
    const state = feedReducer(initialState, {
      type: 'feeds/getOrderByNumber/rejected',
      error: { message: 'Order not found' }
    });

    expect(state.isLoadingCurrentOrder).toBe(false);
    expect(state.currentOrderError).toContain('Order not found');
  });
});

describe('feedSlice selectors', () => {
  beforeEach(() => {
    initialState.data = null;
    initialState.isLoading = false;
    initialState.error = null;
    initialState.currentOrder = null;
    initialState.isLoadingCurrentOrder = false;
    initialState.currentOrderError = null;
  });

  describe('slice selectors', () => {
    it('should return orders from feed data', () => {
      const state = {
        feed: {
          ...initialState,
          data: mockOrderData
        }
      };

      const orders = getOrders(state);
      expect(orders).toEqual(mockOrderData.orders);
    });

    it('should return current order', () => {
      const state = {
        feed: {
          ...initialState,
          currentOrder: mockCurrentOrder
        }
      };

      const currentOrder = getCurrentOrder(state);
      expect(currentOrder).toEqual(mockCurrentOrder);
    });

    it('should return feed data', () => {
      const state = {
        feed: {
          ...initialState,
          data: mockOrderData
        }
      };

      const feed = getFeed(state);
      expect(feed).toEqual(mockOrderData);
    });
  });
});
