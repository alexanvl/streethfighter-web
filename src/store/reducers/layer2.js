import { actionTypes } from '../actions'

const initialState = {
  layer2lib: null,
  web3: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.layer2.INIT:
      return {
        ...state,
        layer2lib: action.layer2lib,
        web3: action.web3
      }
    default:
      return state;
  }
}
