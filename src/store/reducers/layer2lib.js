const actions = {
  INIT: 'INIT',
};

const initialState = {
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.INIT:
      const newState = state;
      return newState;
    default:
      return state;
  }
}
