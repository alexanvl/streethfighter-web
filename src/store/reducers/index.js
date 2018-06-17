import { combineReducers } from 'redux';
import firebaseReducer from './firebase'
import gameReducer from './game'
import layer2libReducer from './layer2lib'

export default combineReducers({
  firebaseReducer,
  gameReducer,
  layer2libReducer
});
