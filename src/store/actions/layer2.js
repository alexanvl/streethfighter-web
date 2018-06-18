const actions = {
  INIT: 'INIT',
  GET_BALANCE: 'GET_BALANCE',
  CREATE_AGREEMENT: 'CREATE_AGREEMENT',
  UPDATE_AGREEMENT: 'UPDATE_AGREEMENT',
  JOIN_AGREEMENT: 'JOIN_AGREEMENT',
  OPEN_CHANNEL: 'OPEN_CHANNEL',
  JOIN_CHANNEL: 'JOIN_CHANNEL',
};

export function init(publicKey, privateKey) {
  return { type: actions.INIT, privateKey, publicKey };
}

export function getBalance(address) {
  return { type: actions.GET_BALANCE, address };
}

export function createAgreement(partyB, amount) {
  return { type: actions.CREATE_AGREEMENT, partyB, amount };
}

export function updateAgreement(agreement) {
  return { type: actions.UPDATE_AGREEMENT, agreement };
}

export function joinAgreement(agreement, state) {
  return { type: actions.JOIN_AGREEMENT, agreement, state };
}

export function openChannel(agreement, amount) {
  return { type: actions.OPEN_CHANNEL, agreement, amount };
}

export function joinChannel(channel, agreement) {
  return { type: actions.JOIN_CHANNEL, agreement, channel };
}

export default actions;
