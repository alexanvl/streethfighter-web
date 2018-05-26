import { bindActionCreators } from 'redux';
import firebase, * as firebaseActions from './firebase';
import layer2lib, * as layer2libActions from './layer2lib';

// allow middleware and reducers to import specific action constants from this index
export const actionTypes = {
  firebase,
  layer2lib,
};

// by default, export a function to map all actions bound to dispatch
// for use when injecting redux or in middleware
export default (dispatch) => {
  return {
    firebaseActions: bindActionCreators({ ...firebaseActions }, dispatch),
    layer2libActions: bindActionCreators({ ...layer2libActions }, dispatch),
  };
}
