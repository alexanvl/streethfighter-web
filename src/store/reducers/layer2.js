import { actionTypes } from '../actions'

const initialState = {
  publicKey: null,
  // TODO store this elsewhere
  privateKey: null,
  layer2lib: null,
  web3: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.layer2.INIT:
      return {
        ...state,
        publicKey: action.publicKey,
        privateKey: action.privateKey,
        layer2lib: action.layer2lib,
        web3: action.web3
      }
    default:
      return state;
  }
}
