import * as Layer2lib from 'js-layer2lib';
import Web3 from 'web3';
import { WEB3_URL } from '../../config';
import bindActions, { actionTypes } from '../actions';
import firebase from './apis/firebase';

export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    // prevent uninitialized usage of any layer2 actions
    if (
      action.type !== actionTypes.layer2.INIT &&
      actionTypes.layer2.hasOwnProperty(action.type)
    ) {
      const { layer2lib, web3 } = getState().layer2Reducer;

      if (!layer2lib || !web3) {
        throw new Error('layer2 uninitialized, use props.layer2Actions.init()');
      }
    }

    switch (action.type) {

      case actionTypes.layer2.INIT: {
        let { layer2lib, web3 } = getState().layer2Reducer;

        if (!layer2lib) {
          const firebaseProxy = new Layer2lib.FirebaseStorageProxy(firebase, `layer2_${action.publicKey}/`);
          const options = {
            db: firebaseProxy,
            privateKey: action.privateKey
          }

          layer2lib = new Layer2lib(WEB3_URL, options);
          layer2lib.initGSC();
        }

        if (!web3) {
          web3 = new Web3();
          web3.setProvider(new web3.providers.HttpProvider(WEB3_URL));
        }

        action.layer2lib = layer2lib;
        action.web3 = web3;

        return next(action);
      }
      case actionTypes.layer2.GET_BALANCE: {
        const { web3 } = getState().layer2Reducer;

        return web3.eth.getBalance(action.adress);
      }
      default:
        return next(action);
    }
  };
}
