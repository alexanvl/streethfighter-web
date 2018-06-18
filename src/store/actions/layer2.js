const actions = {
  INIT: 'INIT',
  GET_BALANCE: 'GET_BALANCE',
};

export function init(publicKey, privateKey) {
  return { type: actions.INIT, privateKey, publicKey };
}

export function getBalance(address) {
  return { type: actions.GET_BALANCE, address };
}

export default actions;
