import { combineReducers } from 'redux';
import firebaseReducer from './firebase'
import gameReducer from './game'
import layer2Reducer from './layer2'

export default combineReducers({
  firebaseReducer,
  gameReducer,
  layer2Reducer
});
