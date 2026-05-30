import { configureStore } from '@reduxjs/toolkit';
import {
  fetchIngredients,
  ingredientsReducer,
  getIngredients,
  getLoading,
  getError,
  getIngredientById,
  getBuns,
  getMains,
  getSauces
} from './ingredients';
import { describe, it, expect, beforeEach } from '@jest/globals';

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null as string | null
};

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  }
];

describe('async actions reducers', () => {
  test('fetch ingredients pending', () => {
    const state = ingredientsReducer(initialState, {
      type: 'ingredients/fetchIngredients/pending'
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetch ingredients fulfilled', () => {
    const state = ingredientsReducer(initialState, {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('fetch ingredients rejected', () => {
    const state = ingredientsReducer(initialState, {
      type: 'ingredients/fetchIngredients/rejected',
      error: { message: 'Network error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toContain('Network error');
  });
});

describe('ingredientsSlice selectors', () => {
  beforeEach(() => {
    initialState.ingredients = [];
    initialState.isLoading = false;
    initialState.error = null;
  });

  describe('getIngredientById selector', () => {
    it('should return ingredient by id', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const ingredient = getIngredientById('643d69a5c3f7b9001cfa093c')(state);

      expect(ingredient).toBeDefined();
      expect(ingredient?._id).toBe('643d69a5c3f7b9001cfa093c');
      expect(ingredient?.name).toBe('Краторная булка N-200i');
    });

    it('should return undefined when id does not exist', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const ingredient = getIngredientById('non-existent')(state);

      expect(ingredient).toBeUndefined();
    });

    it('should return undefined when id is undefined', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const ingredient = getIngredientById(undefined)(state);

      expect(ingredient).toBeUndefined();
    });

    it('should handle empty ingredients array', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: []
        }
      };

      const ingredient = getIngredientById('bun-1')(state);

      expect(ingredient).toBeUndefined();
    });
  });

  describe('getBuns selector', () => {
    it('should return only ingredients with type bun', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const buns = getBuns(state);

      expect(buns).toHaveLength(1);
      expect(buns.every((bun) => bun.type === 'bun')).toBe(true);
    });

    it('should return empty array when no buns exist', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: [
            mockIngredients[1],
            mockIngredients[2],
            mockIngredients[3]
          ]
        }
      };

      const buns = getBuns(state);

      expect(buns).toHaveLength(0);
    });

    it('should handle empty ingredients array', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: []
        }
      };

      const buns = getBuns(state);

      expect(buns).toEqual([]);
    });
  });

  describe('getMains selector', () => {
    it('should return only ingredients with type main', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const mains = getMains(state);

      expect(mains).toHaveLength(2);
      expect(mains.every((main) => main.type === 'main')).toBe(true);
      expect(mains.map((main) => main.name)).toEqual([
        'Биокотлета из марсианской Магнолии',
        'Филе Люминесцентного тетраодонтимформа'
      ]);
    });

    it('should return empty array when no mains exist', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: [mockIngredients[0], mockIngredients[3]]
        }
      };

      const mains = getMains(state);

      expect(mains).toHaveLength(0);
    });

    it('should handle empty ingredients array', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: []
        }
      };

      const mains = getMains(state);

      expect(mains).toEqual([]);
    });
  });

  describe('getSauces selector', () => {
    it('should return only ingredients with type sauce', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const sauces = getSauces(state);

      expect(sauces).toHaveLength(1);
      expect(sauces.every((sauce) => sauce.type === 'sauce')).toBe(true);
      expect(sauces[0].name).toBe('Соус Spicy-X');
    });

    it('should return empty array when no sauces exist', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: [
            mockIngredients[0],
            mockIngredients[1],
            mockIngredients[2]
          ]
        }
      };

      const sauces = getSauces(state);

      expect(sauces).toHaveLength(0);
    });

    it('should handle empty ingredients array', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: []
        }
      };

      const sauces = getSauces(state);

      expect(sauces).toEqual([]);
    });
  });

  describe('slice selectors', () => {
    it('should return ingredients', () => {
      const state = {
        ingredients: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const ingredients = getIngredients(state);
      expect(ingredients).toEqual(mockIngredients);
    });

    it('should return loading state', () => {
      const state = {
        ingredients: {
          ...initialState,
          isLoading: true
        }
      };

      const isLoading = getLoading(state);
      expect(isLoading).toBe(true);
    });

    it('should return error', () => {
      const state = {
        ingredients: {
          ...initialState,
          error: 'Test error'
        }
      };

      const error = getError(state);
      expect(error).toBe('Test error');
    });
  });
});
