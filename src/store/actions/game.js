const actions = {
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  SET_ACCOUNT: 'SET_ACCOUNT',
  LISTEN_LOBBY_ON: 'LISTEN_LOBBY_ON',
  LISTEN_LOBBY_OFF: 'LISTEN_LOBBY_OFF',
  SET_LOBBY: 'SET_LOBBY',
  UPDATE_PROPOSAL: 'UPDATE_PROPOSAL'
};

export function getAccounts() {
  return { type: actions.GET_ACCOUNTS }
}

export function setAccount(publicKey) {
  return { type: actions.SET_ACCOUNT, publicKey };
}

export function listenLobbyOn() {
  return { type: actions.LISTEN_LOBBY_ON };
}

export function listenLobbyOff() {
  return { type: actions.LISTEN_LOBBY_OFF };
}

export function setLobby(lobby) {
  return { type: actions.SET_LOBBY, lobby };
}

export function updateProposal(proposal) {
  return { type: actions.UPDATE_PROPOSAL, proposal };
}

export default actions;
