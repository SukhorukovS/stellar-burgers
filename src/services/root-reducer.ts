import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredients';
import { burgerConstructorReducer } from './slices/burger-constructor';
// import feedReducer from './slices/feed-slice';
// import userReducer from './slices/user-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer
  // feed: feedReducer,
  // user: userReducer
});
