import { TOrder } from '@utils-types';
import {
  addIngredient,
  removeIngredientByIndex,
  moveIngredientUp,
  moveIngredientDown,
  burgerConstructorReducer
} from './burger-constructor';

const initialState = {
  orderRequest: false,
  error: null as string | null,
  orderData: null as TOrder | null,
  constructorItems: {
    bun: { price: 0, name: '', image: '', id: '', _id: '' } as null | {
      price: number;
      name: string;
      image: string;
      id: string;
      _id: string;
    },
    ingredients: [] as any[]
  }
};

describe('burgerConstructor reducer', () => {
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

  describe('addIngredient', () => {
    it('should add ingredient to the constructor', () => {
      const action = addIngredient(mockIngredient);
      const state = burgerConstructorReducer(initialState, action);

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

      const ingredientToRemove = state.constructorItems.ingredients[1];

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
