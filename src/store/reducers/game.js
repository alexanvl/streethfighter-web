import { actionTypes } from '../actions'

const initialState = {
  account: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.game.SET_ACCOUNT:
      return {
        ...state,
        account: action.account
      }
    default:
      return state;
  }
}