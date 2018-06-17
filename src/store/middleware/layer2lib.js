import * as Layer2lib from 'js-layer2lib';
import bindActions, { actionTypes } from '../actions';
import firebase from './apis/firebase';

let layer2lib = null

export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    switch (action.type) {

      case actionTypes.layer2lib.INIT: {
        if (!layer2lib) {
          const firebaseProxy = new Layer2lib.FirebaseStorageProxy(firebase, `layer2_${action.publicKey}/`);
          const options = {
            db: firebaseProxy,
            privateKey: action.privateKey
          }

          layer2lib = new Layer2lib("https://rinkeby.infura.io", options);
          layer2lib.initGSC();
        }

        action.instance = layer2lib;

        return next(action);
      }
      default:
        return next(action);
    }
  };
}
