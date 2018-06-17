const actions = {
  INIT: 'INIT',
};

export function init(publicKey, privateKey) {
  return { type: actions.INIT, privateKey, publicKey };
}

export default actions;
