import { actionTypes } from '../actions'

const initialState = {
  account: null,
  lobby: [],
  proposal: null,
  channelParty: '',
  lobbyInterval: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.game.SET_ACCOUNT: {
      return {
        ...state,
        account: action.account
      }
    }
    case actionTypes.game.LISTEN_LOBBY_ON: {
      return {
        ...state,
        lobbyInterval: action.lobbyInterval
      }
    }
    case actionTypes.game.LISTEN_LOBBY_OFF: {
      return {
        ...state,
        lobbyInterval: null
      }
    }
    case actionTypes.game.SET_LOBBY: {
      return {
        ...state,
        lobby: action.lobby
      }
    }
    case actionTypes.game.UPDATE_PROPOSAL: {
      return {
        ...state,
        proposal: action.proposal,
        channelParty: action.channelParty
      }
    }
    default:
      return state;
  }
}