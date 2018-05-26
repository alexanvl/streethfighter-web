const actions = {
  INIT: 'INIT',
};

export function init(privateKey) {
  return { type: actions.INIT, privateKey };
}

export default actions;