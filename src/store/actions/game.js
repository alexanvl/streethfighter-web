const actions = {
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  SET_ACCOUNT: 'SET_ACCOUNT',
  LISTEN_LOBBY_ON: 'LISTEN_LOBBY_ON',
  LISTEN_LOBBY_OFF: 'LISTEN_LOBBY_OFF',
  SET_LOBBY: 'SET_LOBBY',
  UPDATE_PROPOSAL: 'UPDATE_PROPOSAL',
  SET_BALANCE: 'SET_BALANCE',
  LISTEN_GAME_ON: 'LISTEN_GAME_ON',
  LISTEN_GAME_OFF: 'LISTEN_GAME_OFF',
  HANDLE_GAME_STATE: 'HANDLE_GAME_STATE',
  SET_PLAYER_STATE: 'SET_PLAYER_STATE',
  TURN: 'TURN',
}

export function getAccounts() {
  return { type: actions.GET_ACCOUNTS }
}

export function setAccount(publicKey) {
  return { type: actions.SET_ACCOUNT, publicKey }
}

export function listenLobbyOn() {
  return { type: actions.LISTEN_LOBBY_ON }
}

export function listenLobbyOff() {
  return { type: actions.LISTEN_LOBBY_OFF }
}

export function setLobby(lobby) {
  return { type: actions.SET_LOBBY, lobby }
}

export function updateProposal(proposal) {
  return { type: actions.UPDATE_PROPOSAL, proposal }
}

export function setBalance(address, balance) {
  return { type: actions.SET_BALANCE, address, balance }
}

export function listenGameOn(cb) {
  return { type: actions.LISTEN_GAME_ON, cb }
}

export function listenGameOff() {
  return { type: actions.LISTEN_GAME_OFF }
}

export function handleGameState(gameState) {
  return { type: actions.HANDLE_GAME_STATE, gameState }
}

export function setPlayerState(playerState) {
  return { type: actions.SET_PLAYER_STATE, playerState }
}

export function turn(playerState) {
  return { type: actions.TURN, playerState }
}

export default actions
