import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredients';
import { burgerConstructorReducer } from './slices/burger-constructor';
import { feedReducer } from './slices/feeds';
import { userReducer } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  user: userReducer
});
