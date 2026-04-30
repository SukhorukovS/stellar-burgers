import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

type TBun = {
  price: number;
  name: string;
  image: string;
  id: string;
} | null;

type TConstructorItems = {
  constructorItems: {
    bun: TBun;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructorItems = {
  constructorItems: { bun: null, ingredients: [] }
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: { payload: TBun }) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action: { payload: TConstructorIngredient }) => {
      state.constructorItems.ingredients.push(action.payload);
    }
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const { addBun, addIngredient } = burgerConstructorSlice.actions;

export const { getConstructorItems } = burgerConstructorSlice.selectors;
