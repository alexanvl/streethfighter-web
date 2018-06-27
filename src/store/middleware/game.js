import config from '../../config'
import bindActions, { actionTypes } from '../actions'
import * as db from './apis/firebase'

const GAME_DATA = config.GAME_DATA
const LOBBY_INTERVAL = 5000//ms
const LOBBY_TIMEOUT = 10000//ms

export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch)

  return next => (action) => {
    switch (action.type) {
      case actionTypes.game.GET_ACCOUNTS: {
        // TODO accounts
        return Object.keys(config.PRIVATE_KEYS)
      }
      case actionTypes.game.SET_ACCOUNT: {
        const { publicKey } = action
        const privateKey = config.PRIVATE_KEYS[publicKey]
        actions.layer2Actions.init(publicKey, privateKey)
        action.account = publicKey

        return next(action)
      }
      case actionTypes.game.LISTEN_LOBBY_ON: {
        const { account, lobbyInterval } = getState().gameReducer

        if (!lobbyInterval) {
          action.lobbyInterval = setInterval(() => {
            db.update(`lobby/${account}`, {
              publicKey: account,
              timestamp: Date.now()
            })
          }, LOBBY_INTERVAL)
        }

        next(action)

        return Promise.all([
          db.listenOn('lobby', actions.gameActions.setLobby),
          db.listenOn(
            `game_proposals/${account}`,
            actions.gameActions.updateProposal
          ),
        ])
      }
      case actionTypes.game.LISTEN_LOBBY_OFF: {
        const { account, lobbyInterval } = getState().gameReducer

        if (lobbyInterval) {
          clearInterval(lobbyInterval)
        }

        next(action)

        return Promise.all([
          db.listenOff('lobby'),
          db.listenOff(`game_proposals/${account}`),
          db.remove(`lobby/${account}`),
        ])
      }
      case actionTypes.game.SET_LOBBY: {
        const { account, balances } = getState().gameReducer
        const { lobby } = action
        const valid = []
        // filter lobby users
        Object.keys(lobby || {}).forEach(publicKey => {
          const user = lobby[publicKey]

          if (user.timestamp > Date.now() - LOBBY_TIMEOUT) {
            // query balance if we don't have it
            // TODO call this more frequently?
            if (!balances.hasOwnProperty(publicKey)) {
              actions.layer2Actions.getBalance(publicKey)
                .then(balance =>
                  actions.gameActions.setBalance(publicKey, balance)
                )
            } else if (balances[publicKey] > 0 && publicKey !== account) {
              // add users who are not ourself to the lobby
              valid.push(user)
            }
          }
        })

        action.lobby = valid

        return next(action)
      }
      case actionTypes.game.UPDATE_PROPOSAL: {
        const { account } = getState().gameReducer
        const { proposal } = action

        if (
          proposal &&
          proposal.agreement
         ) {
          actions.layer2Actions.updateAgreement(proposal.agreement)
          action.channelParty = proposal.agreement.partyA === account ? 'A' : 'B'
        }

        return next(action)
      }
      case actionTypes.layer2.AGREEMENT_CREATED: {
        const { account } = getState().gameReducer
        const { partyB, agreement, state } = action

        return db.update('game_proposals', {
          [account]: {
            next: 'agreementCreated',
            state,
            agreement
          },
          [partyB]: {
            next: 'joinAgreement',
            state,
            agreement
          }
        })
      }
      case actionTypes.layer2.AGREEMENT_JOINED: {
        const { account } = getState().gameReducer
        const { counterparty, agreement, state } = action

        return db.update('game_proposals', {
          [account]: {
            next: 'agreementJoined',
            state,
            agreement
          },
          [counterparty]: {
            next: 'openChannel',
            state,
            agreement
          }
        })
      }
      case actionTypes.layer2.CHANNEL_OPENED: {
        const { account } = getState().gameReducer
        const { counterparty, agreement, channel } = action

        return db.update('game_proposals', {
          [account]: {
            next: 'channelOpened',
            agreement,
            channel
          },
          [counterparty]: {
            next: 'joinChannel',
            agreement,
            channel
          }
        })
      }
      case actionTypes.layer2.CHANNEL_JOINED: {
        const { account } = getState().gameReducer
        const { counterparty, agreement, channel } = action

        return db.update('game_proposals', {
          [account]: {
            next: 'enterGame',
            agreement,
            channel
          },
          [counterparty]: {
            next: 'enterGame',
            agreement,
            channel
          }
        })
      }
      case actionTypes.game.LISTEN_GAME_ON: {
        const {
          channelParty,
          proposal: {
            agreement: { partyA, partyB }
          }
        } = getState().gameReducer
        const { cb } = action

        return Promise.all([
          db.update(`game_states/${partyA}${partyB}`, GAME_DATA.initialGameState),
          db.listenOn(
            `game_states/${partyA}${partyB}`,
            state => {
              const { gameState } = getState().gameReducer
              const counterParty = channelParty === 'A' ? 'B' : 'A'
              const currNonce = state[counterParty].nonce
              const prevNonce = gameState[counterParty] && gameState[counterParty].nonce

              if (currNonce > prevNonce) {
                cb(state[counterParty])
              }

              actions.gameActions.handleGameState(state)
            }
          )
        ])
      }
      case actionTypes.game.LISTEN_GAME_OFF: {
        const {
          proposal: {
            agreement: { partyA, partyB }
          }
        } = getState().gameReducer

        return db.listenOff(`game_states/${partyA}${partyB}`)
      }
      case actionTypes.game.HANDLE_GAME_STATE: {
        const {
          channelParty,
          gameState: currGameState
        } = getState().gameReducer
        let { gameState: nextGameState } = action
        console.log('current game state', currGameState)
        console.log('next game state', nextGameState)
        // do some logic
        if (nextGameState) {
          nextGameState.isMyTurn = nextGameState.turn === channelParty
        } else {
          // initialize local copy and set player turn
          nextGameState = {
            ...GAME_DATA.initialGameState,
            isMyTurn: channelParty === 'B',
          }
        }

        return next(action)
      }
      case actionTypes.game.TURN: {
        const {
          channelParty,
          proposal: {
            agreement: { partyA, partyB }
          },
          gameState,
        } = getState().gameReducer
        const partyKey = channelParty == 'A' ? 'B' : 'A'

        action.turn = partyKey;
        action.nonce = gameState[channelParty].nonce + 1

        next(action)

        const updates = {
          turn: partyKey,
          [`${channelParty}/playerState`]: action.playerState,
          [`${channelParty}/nonce`]: action.nonce
        }

        return db.update(`game_states/${partyA}${partyB}`, updates)
      }
      default:
        return next(action)
    }
  }
}
