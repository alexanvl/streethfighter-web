import { combineReducers } from 'redux';
import firebaseReducer from './firebase'
import layer2libReducer from './layer2lib'

export default combineReducers({
  firebaseReducer,
  layer2libReducer
});
