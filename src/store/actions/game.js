const actions = {
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  SET_ACCOUNT: 'SET_ACCOUNT',
};

export function getAccounts() {
  return { type: actions.GET_ACCOUNTS }
}

export function setAccount(publicKey) {
  return { type: actions.SET_ACCOUNT, publicKey };
}

export default actions;
