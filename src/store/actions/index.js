import { bindActionCreators } from 'redux';
import firebase, * as firebaseActions from './firebase';
import game, * as gameActions from './game';
import layer2, * as layer2Actions from './layer2';

// allow middleware and reducers to import specific action constants from this index
export const actionTypes = {
  firebase,
  game,
  layer2,
};

// by default, export a function to map all actions bound to dispatch
// for use when injecting redux or in middleware
export default (dispatch) => {
  return {
    firebaseActions: bindActionCreators({ ...firebaseActions }, dispatch),
    gameActions: bindActionCreators({ ...gameActions }, dispatch),
    layer2Actions: bindActionCreators({ ...layer2Actions }, dispatch),
  };
}
