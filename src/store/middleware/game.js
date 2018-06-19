import * as firebase from './apis/firebase';
import config from '../../config'
import bindActions, { actionTypes } from '../actions';

const LOBBY_INTERVAL = 5000;//ms
const LOBBY_TIMEOUT = 10000;//ms


export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    switch (action.type) {
      case actionTypes.game.GET_ACCOUNTS: {
        // TODO accounts
        return Object.keys(config.PRIVATE_KEYS);
      }
      case actionTypes.game.SET_ACCOUNT: {
        const { publicKey } = action;
        const privateKey = config.PRIVATE_KEYS[publicKey];
        actions.layer2Actions.init(publicKey, privateKey);
        action.account = publicKey;

        return next(action);
      }
      case actionTypes.game.LISTEN_LOBBY_ON: {
        const { account, lobbyInterval } = getState().gameReducer;

        if (!lobbyInterval) {
          action.lobbyInterval = setInterval(() => {
            firebase.update(`lobby/${account}`, {
              publicKey: account,
              timestamp: Date.now()
            });
          }, LOBBY_INTERVAL);
        }

        next(action);

        return Promise.all([
          firebase.listenOn('lobby', actions.gameActions.setLobby),
          firebase.listenOn(
            `agreementProposal/${account}`,
            actions.gameActions.updateProposal
          ),
        ]);
      }
      case actionTypes.game.LISTEN_LOBBY_OFF: {
        const { account, lobbyInterval } = getState().gameReducer;

        if (lobbyInterval) {
          clearInterval(lobbyInterval);
        }

        next(action);

        return Promise.all([
          firebase.listenOff('lobby'),
          firebase.listenOff(`agreementProposal/${account}`),
          firebase.remove(`lobby/${account}`),
        ]);
      }
      case actionTypes.game.SET_LOBBY: {
        const { account, balances } = getState().gameReducer;
        const { lobby } = action;
        const valid = [];
        // filter lobby users
        Object.keys(lobby || {}).forEach(publicKey => {
          const user = lobby[publicKey];

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
              valid.push(user);
            }
          }
        });

        action.lobby = valid;

        return next(action);
      }
      case actionTypes.game.UPDATE_PROPOSAL: {
        const { account } = getState().gameReducer;
        const { proposal } = action;

        if (
          proposal &&
          proposal.agreement
         ) {
          actions.layer2Actions.updateAgreement(proposal.agreement);
        }

        return next(action);
      }
      default:
        return next(action);
    }
  };
}
