import { actionTypes } from '../actions'

const initialState = {
  account: null,
  lobby: [],
  balances: {},
  proposal: null,
  channelParty: '',
  lobbyInterval: null,
  gameState: {},
}

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
        proposal: { ...action.proposal },
        channelParty: action.channelParty || state.channelParty
      }
    }
    case actionTypes.game.SET_BALANCE: {
      return {
        ...state,
        balances: {
          ...state.balances,
          [action.address]: action.balance
        }
      }
    }
    case actionTypes.game.HANDLE_GAME_STATE: {
      return {
        ...state,
        gameState: {
          ...action.gameState
        }
      }
    }
    case actionTypes.game.LISTEN_GAME_OFF: {
      return {
        ...state,
        gameState: { }
      }
    }
    case actionTypes.game.SET_PLAYER_STATE: {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          [state.channelParty]: {
            ...state.gameState[state.channelParty],
            playerState: action.playerState,
          }
        }
      }
    }
    case actionTypes.game.TURN: {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          turn: action.turn,
          isMyTurn: false,
          [state.channelParty]: {
            ...state.gameState[state.channelParty],
            playerState: action.playerState,
          }
        }
      }
    }
    default:
      return state
  }
}