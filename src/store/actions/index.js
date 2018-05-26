import { bindActionCreators } from 'redux';
import firebase, * as firebaseActions from './firebase';

// allow middleware and reducers to import specific action constants from this index
export const actionTypes = {
  firebase
};

// by default, export a function to map all actions bound to dispatch
// for use when injecting redux or in middleware
export default (dispatch) => {
  return {
    firebaseActions: bindActionCreators({ ...firebaseActions }, dispatch)
  };
}
