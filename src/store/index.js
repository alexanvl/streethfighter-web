import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import firebaseMiddleware from './middleware/firebase';
import layer2libMiddleware from './middleware/layer2lib';
import rootReducer from './reducers';

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
