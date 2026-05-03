import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

type TBun = {
  price: number;
  name: string;
  image: string;
  id: string;
} | null;

type TConstructorBurger = {
  constructorItems: {
    bun: TBun;
    ingredients: TConstructorIngredient[];
  };
  error: string | null;
  orderRequest: boolean;
  orderData: TOrder | null;
};

const initialState: TConstructorBurger = {
  orderRequest: false,
  error: null,
  orderData: null,
  constructorItems: { bun: null, ingredients: [] }
};

export const orderBurger = createAsyncThunk(
  'burger/orderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: { payload: TBun }) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action: { payload: TConstructorIngredient }) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredientByIndex: (state, action) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    moveIngredientUp: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload - 1]
      ] = [
        state.constructorItems.ingredients[action.payload - 1],
        state.constructorItems.ingredients[action.payload]
      ];
    },
    moveIngredientDown: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload + 1]
      ] = [
        state.constructorItems.ingredients[action.payload + 1],
        state.constructorItems.ingredients[action.payload]
      ];
    }
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getNewOrder: (state) => state.orderData,
    getOrderRequest: (state) => state.orderRequest
  },
  extraReducers(builder) {
    builder.addCase(orderBurger.pending, (state) => {
      state.error = null;
      state.orderRequest = true;
    });
    builder.addCase(orderBurger.fulfilled, (state, action) => {
      state.error = null;
      state.orderRequest = action.payload.success;
      state.orderData = action.payload.order;
    });
    builder.addCase(orderBurger.rejected, (state, action) => {
      state.error = action.error.message || 'Error during order burger';
      state.orderRequest = false;
    });
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const {
  addBun,
  addIngredient,
  removeIngredientByIndex,
  moveIngredientUp,
  moveIngredientDown
} = burgerConstructorSlice.actions;

export const { getConstructorItems, getOrderRequest, getNewOrder } =
  burgerConstructorSlice.selectors;
