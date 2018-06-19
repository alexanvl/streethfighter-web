const actions = {
  INIT: 'INIT',
  GET_BALANCE: 'GET_BALANCE',
  CREATE_AGREEMENT: 'CREATE_AGREEMENT',
  AGREEMENT_CREATED: 'AGREEMENT_CREATED',
  UPDATE_AGREEMENT: 'UPDATE_AGREEMENT',
  JOIN_AGREEMENT: 'JOIN_AGREEMENT',
  AGREEMENT_JOINED: 'AGREEMENT_JOINED',
  OPEN_CHANNEL: 'OPEN_CHANNEL',
  CHANNEL_OPENED: 'CHANNEL_OPENED',
  JOIN_CHANNEL: 'JOIN_CHANNEL',
  CHANNEL_JOINED: 'CHANNEL_JOINED',
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

export function agreementCreated(partyB, agreement, state) {
  return { type: actions.AGREEMENT_CREATED, partyB, agreement, state };
}

export function updateAgreement(agreement) {
  return { type: actions.UPDATE_AGREEMENT, agreement };
}

export function joinAgreement(agreement, state) {
  return { type: actions.JOIN_AGREEMENT, agreement, state };
}

export function agreementjoined(counterparty, agreement, state) {
  return { type: actions.AGREEMENT_JOINED, counterparty, agreement, state };
}

export function openChannel(agreement, amount) {
  return { type: actions.OPEN_CHANNEL, agreement, amount };
}

export function channelOpened(counterparty, agreement, channel) {
  return { type: actions.CHANNEL_OPENED, counterparty, agreement, channel };
}

export function joinChannel(channel, agreement) {
  return { type: actions.JOIN_CHANNEL, agreement, channel };
}

export function channelJoined(counterparty, agreement, channel) {
  return { type: actions.CHANNEL_JOINED, counterparty, agreement, channel };
}

export default actions;
