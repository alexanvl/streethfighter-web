import { actionTypes } from '../actions'

const initialState = {
  instance: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.layer2lib.INIT:
      return {
        ...state,
        instance: action.instance
      }
    default:
      return state;
  }
}
