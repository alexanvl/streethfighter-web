import * as Layer2lib from 'js-layer2lib';
import Web3 from 'web3';
import config from '../../config';
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

          layer2lib = new Layer2lib(config.WEB3_URL, options);
          layer2lib.initGSC();
        }

        if (!web3) {
          web3 = new Web3();
          web3.setProvider(new web3.providers.HttpProvider(config.WEB3_URL));
        }

        action.layer2lib = layer2lib;
        action.web3 = web3;

        return next(action);
      }
      case actionTypes.layer2.GET_BALANCE: {
        const { web3 } = getState().layer2Reducer;

        return web3.eth.getBalance(action.address).then(
          balance => parseFloat(web3.utils.fromWei(balance)).toFixed(4)
        )
      }
      case actionTypes.layer2.CREATE_AGREEMENT: {
        const { layer2lib, web3, publicKey: partyA } = getState().layer2Reducer;
        const { partyB, amount } = action;
        const agreement = {
          ID: `agreement_${partyA}${partyB}`,
          types: ['Ether'],
          partyA,
          partyB,
          balanceA: web3.utils.toWei(amount, 'ether'),
          balanceB: web3.utils.toWei(amount, 'ether'),
        };

        return layer2lib.createGSCAgreement(agreement)
          .then(() => layer2lib.gsc.getStates(agreement.ID))
          .then(state =>
            actions.layer2Actions.agreementCreated(partyB, agreement, state)
          );
      }
      case actionTypes.layer2.UPDATE_AGREEMENT: {
        const { layer2lib } = getState().layer2Reducer;
        const { agreement } = action;

        return layer2lib.gsc.updateAgreement(agreement);
      }
      case actionTypes.layer2.JOIN_AGREEMENT: {
        const { layer2lib, publicKey } = getState().layer2Reducer;
        const { agreement, state } = action;
        const counterparty = (agreement.partyA === publicKey) ?
          agreement.partyB : agreement.partyA;

        return layer2lib.joinGSCAgreement(agreement, state)
          .then(() => actions.layer2Actions
            .agreementjoined(counterparty, agreement, state)
          )
      }
      case actionTypes.layer2.OPEN_CHANNEL: {
        const { layer2lib, publicKey, web3 } = getState().layer2Reducer;
        const { agreement, amount } = action;
        const counterparty = (agreement.partyA === publicKey) ?
          agreement.partyB : agreement.partyA;
        const channel = {
          ID: `channel_${publicKey}${counterparty}`,
          agreementID: agreement.ID,
          type: 'ether',
          balanceA: web3.utils.toWei(amount, 'ether'),
          balanceB: web3.utils.toWei(amount, 'ether'),
        };

        return layer2lib.openGSCChannel(channel)
          .then(() => actions.layer2Actions
            .channelOpened(counterparty, agreement, channel)
          )
      }
      case actionTypes.layer2.JOIN_CHANNEL: {
        const { layer2lib, publicKey } = getState().layer2Reducer;
        const { agreement, channel } = action;
        const counterparty = (agreement.partyA === publicKey) ?
          agreement.partyB : agreement.partyA;

        return layer2lib.gsc.joinChannel(channel, agreement, channel.stateRaw)
          .then(() => actions.layer2Actions
            .channelJoined(counterparty, agreement, channel)
          )
      }
      default:
        return next(action);
    }
  };
}
