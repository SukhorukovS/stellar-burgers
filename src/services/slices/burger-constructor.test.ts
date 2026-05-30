import { configureStore } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  addBun,
  addIngredient,
  removeIngredientByIndex,
  moveIngredientUp,
  moveIngredientDown,
  orderBurger,
  burgerConstructorReducer,
  getConstructorItems,
  getNewOrder,
  getOrderRequest
} from './burger-constructor';

const initialState = {
  orderRequest: false,
  error: null as string | null,
  orderData: null as TOrder | null,
  constructorItems: {
    bun: null as {
      price: number;
      name: string;
      image: string;
      id: string;
      _id: string;
    } | null,
    ingredients: [] as any[]
  }
};

const mockIngredient = {
  _id: 'ingredient-1',
  name: 'Котлета',
  type: 'main' as const,
  proteins: 100,
  fat: 50,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'image.jpg',
  image_large: 'image_large.jpg',
  image_mobile: 'image_mobile.jpg'
};

const mockBun = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun' as const,
  proteins: 80,
  fat: 30,
  carbohydrates: 40,
  calories: 300,
  price: 50,
  image: 'bun.jpg',
  image_large: 'bun_large.jpg',
  image_mobile: 'bun_mobile.jpg'
};

const mockOrder = {
  _id: 'order-1',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done' as const,
  name: 'Space Burger',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 1
};

describe('async actions reducers', () => {
  test('order burger pending', () => {
    const state = burgerConstructorReducer(initialState, {
      type: 'burger/orderBurger/pending'
    });

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  test('order burger fulfilled', () => {
    const state = burgerConstructorReducer(initialState, {
      type: 'burger/orderBurger/fulfilled',
      payload: { order: mockOrder, name: 'Space Burger' }
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderData).toEqual(mockOrder);
    expect(state.error).toBeNull();
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  test('order burger rejected', () => {
    const state = burgerConstructorReducer(initialState, {
      type: 'burger/orderBurger/rejected',
      error: { message: 'Order failed' }
    });

    expect(state.orderRequest).toBe(false);
    expect(state.error).toContain('Order failed');
  });
});

describe('burgerConstructor reducer', () => {
  describe('addBun', () => {
    it('should add bun to the constructor', () => {
      const state = burgerConstructorReducer(initialState, addBun(mockBun));

      expect(state.constructorItems.bun).toMatchObject(mockBun);
    });

    it('should replace existing bun with a new one', () => {
      let state = burgerConstructorReducer(initialState, addBun(mockBun));
      const firstBunId = state.constructorItems.bun?.id;

      const anotherBun = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Другая булка'
      };
      state = burgerConstructorReducer(state, addBun(anotherBun));

      expect(state.constructorItems.bun).toMatchObject(anotherBun);
    });

    it('should not affect ingredients when adding bun', () => {
      let state = initialState;
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));
      state = burgerConstructorReducer(state, addBun(mockBun));

      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.constructorItems.bun).toMatchObject(mockBun);
    });
  });

  describe('addIngredient', () => {
    it('should add ingredient to the constructor', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toMatchObject(
        mockIngredient
      );
    });

    it('should add multiple ingredients', () => {
      let state = initialState;
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      expect(state.constructorItems.ingredients).toHaveLength(3);
    });
  });

  describe('removeIngredientByIndex', () => {
    it('should remove ingredient by index', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      expect(state.constructorItems.ingredients).toHaveLength(3);

      state = burgerConstructorReducer(state, removeIngredientByIndex(1));

      expect(state.constructorItems.ingredients).toHaveLength(2);
    });
  });

  describe('moveIngredientUp', () => {
    it('should move ingredient up by one position', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-2' })
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-3' })
      );

      const ingredientToMove = state.constructorItems.ingredients[1];
      const ingredientAbove = state.constructorItems.ingredients[0];

      state = burgerConstructorReducer(state, moveIngredientUp(1));

      expect(state.constructorItems.ingredients[0]).toEqual(ingredientToMove);
      expect(state.constructorItems.ingredients[1]).toEqual(ingredientAbove);
    });
  });

  describe('moveIngredientDown', () => {
    it('should move ingredient down by one position', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-2' })
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-3' })
      );

      const ingredientToMove = state.constructorItems.ingredients[1];
      const ingredientBelow = state.constructorItems.ingredients[2];

      state = burgerConstructorReducer(state, moveIngredientDown(1));

      expect(state.constructorItems.ingredients[1]).toEqual(ingredientBelow);
      expect(state.constructorItems.ingredients[2]).toEqual(ingredientToMove);
    });
  });

  describe('ingredient reordering', () => {
    it('should reorder ingredients correctly after multiple moves', () => {
      let state = initialState;
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-1' })
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-2' })
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-3' })
      );
      state = burgerConstructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ingredient-4' })
      );

      const originalOrder = [...state.constructorItems.ingredients];

      state = burgerConstructorReducer(state, moveIngredientDown(0));

      expect(state.constructorItems.ingredients[0]).toEqual(originalOrder[1]);
      expect(state.constructorItems.ingredients[1]).toEqual(originalOrder[0]);
      expect(state.constructorItems.ingredients[2]).toEqual(originalOrder[2]);
      expect(state.constructorItems.ingredients[3]).toEqual(originalOrder[3]);

      state = burgerConstructorReducer(state, moveIngredientUp(2));

      expect(state.constructorItems.ingredients[0]).toEqual(originalOrder[1]);
      expect(state.constructorItems.ingredients[1]).toEqual(originalOrder[2]);
      expect(state.constructorItems.ingredients[2]).toEqual(originalOrder[0]);
      expect(state.constructorItems.ingredients[3]).toEqual(originalOrder[3]);
    });
  });
});

describe('burgerConstructor selectors', () => {
  describe('slice selectors', () => {
    it('should return constructor items', () => {
      const mockConstructorIngredient = { ...mockIngredient, id: 'test-id' };
      const state = {
        burgerConstructor: {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [mockConstructorIngredient]
          }
        }
      };

      const constructorItems = getConstructorItems(state);
      expect(constructorItems.ingredients).toHaveLength(1);
      expect(constructorItems.ingredients[0]).toMatchObject(mockIngredient);
    });

    it('should return new order', () => {
      const state = {
        burgerConstructor: {
          ...initialState,
          orderData: mockOrder
        }
      };

      const orderData = getNewOrder(state);
      expect(orderData).toEqual(mockOrder);
    });

    it('should return order request status', () => {
      const state = {
        burgerConstructor: {
          ...initialState,
          orderRequest: true
        }
      };

      const orderRequest = getOrderRequest(state);
      expect(orderRequest).toBe(true);
    });
  });
});
