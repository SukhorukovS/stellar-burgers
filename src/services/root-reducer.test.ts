import { rootReducer } from './root-reducer';
import { ingredientsReducer } from './slices/ingredients';
import { burgerConstructorReducer } from './slices/burger-constructor';
import { feedReducer } from './slices/feeds';
import { userReducer } from './slices/user';

describe('rootReducer initialization', () => {
  it('initializes the state correctly', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual({
      burgerConstructor: burgerConstructorReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      ingredients: ingredientsReducer(undefined, initAction),
      user: userReducer(undefined, initAction)
    });
  });

  it('handles unknown action correctly', () => {
    const fakeAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, fakeAction);
    expect(state).toEqual({
      burgerConstructor: burgerConstructorReducer(undefined, fakeAction),
      feed: feedReducer(undefined, fakeAction),
      ingredients: ingredientsReducer(undefined, fakeAction),
      user: userReducer(undefined, fakeAction)
    });
  });
});
