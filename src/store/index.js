import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {
  firebaseMiddleware,
} from './middleware';

export { rootReducer };
export { default as bindActions, actionTypes } from './actions';

export default (initialState) => {
  return createStore(rootReducer, initialState,
    applyMiddleware(
      thunk,
      firebaseMiddleware,
    )
  );
};
