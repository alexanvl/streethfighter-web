import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import firebaseMiddleware from './middleware/firebase';
import gameMiddleware from './middleware/game';
import layer2Middleware from './middleware/layer2';
import rootReducer from './reducers';

export { rootReducer };
export { default as bindActions, actionTypes } from './actions';

export default (initialState) => {
  return createStore(rootReducer, initialState,
    applyMiddleware(
      thunk,
      firebaseMiddleware,
      gameMiddleware,
      layer2Middleware,
    )
  );
};
