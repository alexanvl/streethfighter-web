const actions = {
  INIT: 'INIT',
};

const initialState = {
  instance: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.INIT:
      return {
        ...state,
        instance: action.instance
      }
    default:
      return state;
  }
}
