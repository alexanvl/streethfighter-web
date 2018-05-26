const actions = {
  INIT: 'INIT',
};

const initialState = {
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.INIT:
      const newState = { a: 1 };
      return newState;
    default:
      return state;
  }
}
