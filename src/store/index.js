import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {
  firebaseMiddleware, layer2libMiddleware
} from './middleware';

export { rootReducer };
export { default as bindActions, actionTypes } from './actions';

export default (initialState) => {
  return createStore(rootReducer, initialState,
    applyMiddleware(
      thunk,
      firebaseMiddleware,
      layer2libMiddleware,
    )
  );
};
