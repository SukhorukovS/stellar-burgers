import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    getIngredients: (state) => state.ingredients,
    getLoading: (state) => state.isLoading,
    getError: (state) => state.error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.ingredients = [];
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { getIngredients, getLoading, getError } =
  ingredientsSlice.selectors;

export const getBuns = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'bun')
);

export const getMains = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'main')
);

export const getSauces = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'sauce')
);
