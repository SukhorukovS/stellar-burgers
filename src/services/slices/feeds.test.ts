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

describe('async actions', () => {
  test('loading feeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, ...mockOrderData }),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feeds: feedReducer }
    });

    await store.dispatch(fetchFeeds());

    const { data, isLoading } = store.getState().feeds;
    expect(data).toEqual({ success: true, ...mockOrderData });
    expect(isLoading).toBe(false);
  });

  test('getting order by number', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ orders: [mockCurrentOrder] }),
        ok: true
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feeds: feedReducer }
    });

    await store.dispatch(fetchOrderByNumber(1));

    const { currentOrder, isLoadingCurrentOrder } = store.getState().feeds;
    expect(currentOrder).toEqual(mockCurrentOrder);
    expect(isLoadingCurrentOrder).toBe(false);
  });

  test('handling errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('Network error')),
        ok: false
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feeds: feedReducer }
    });

    await store.dispatch(fetchFeeds());

    const { error, isLoading } = store.getState().feeds;
    expect(isLoading).toBe(false);
    expect(error).not.toBeNull();
  });

  test('handling error in getting order by number', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('Order not found')),
        ok: false
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feeds: feedReducer }
    });

    await store.dispatch(fetchOrderByNumber(999));

    const { currentOrderError, isLoadingCurrentOrder } = store.getState().feeds;
    expect(isLoadingCurrentOrder).toBe(false);
    expect(currentOrderError).not.toBeNull();
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
