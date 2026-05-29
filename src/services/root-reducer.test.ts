import { rootReducer } from './root-reducer';

describe('rootReducer initialization', () => {
  it('should return the initial state with all slices', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('user');

    expect(initialState.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    expect(initialState.burgerConstructor).toEqual({
      orderRequest: false,
      error: null,
      orderData: null,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    });

    expect(initialState.feed).toEqual({
      data: null,
      isLoading: false,
      error: null,
      currentOrder: null,
      isLoadingCurrentOrder: false,
      currentOrderError: null
    });

    expect(initialState.user).toEqual({
      user: null,
      isInitialState: true,
      isLoading: false,
      error: null,
      orders: null,
      isOrdersLoading: false,
      ordersError: null
    });
  });

  it('should return the initial state when called with undefined state and unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      orderRequest: false,
      error: null,
      orderData: null,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    });

    expect(state.feed).toEqual({
      data: null,
      isLoading: false,
      error: null,
      currentOrder: null,
      isLoadingCurrentOrder: false,
      currentOrderError: null
    });

    expect(state.user).toEqual({
      user: null,
      isInitialState: true,
      isLoading: false,
      error: null,
      orders: null,
      isOrdersLoading: false,
      ordersError: null
    });
  });
});
