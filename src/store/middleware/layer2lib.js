import * as Layer2lib from 'js-layer2lib';
import bindActions, { actionTypes } from '../actions';
import firebase from './firebase/api';

const Web3 = require('web3');
const web3 = new Web3();

const firebaseProxy = new Layer2lib.FirebaseStorageProxy(firebase);
let layer2lib = null

export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    switch (action.type) {
      case actionTypes.layer2lib.INIT: {
        if (!layer2lib) {
          const options = {
            db: firebaseProxy,
            privateKey: action.privateKey
          }

          layer2lib = new Layer2lib("http://localhost:8545", options);
        }
        return layer2lib;
      }
      default:
        return next(action);
    }
  };
}
