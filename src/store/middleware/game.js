import * as firebase from './apis/firebase';
import bindActions, { actionTypes } from '../actions';

const privateKeys = {
  '0x1e8524370B7cAf8dC62E3eFfBcA04cCc8e493FfE': '0x2c339e1afdbfd0b724a4793bf73ec3a4c235cceb131dcd60824a06cefbef9875',
  '0x4c88305c5f9e4feb390e6ba73aaef4c64284b7bc': '0xaee55c1744171b2d3fedbbc885a615b190d3dd7e79d56e520a917a95f8a26579',
  '0xd4EA3b21C312D7C6a1c744927a6F80Fe226A8416': '0x9eb0e84b7cadfcbbec8d49ae7112b25e0c1cb158ecd2160c301afa1f4a1029c8'
};

export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    switch (action.type) {
      case actionTypes.game.GET_ACCOUNTS: {
        return Object.keys(privateKeys);
      }
      case actionTypes.game.SET_ACCOUNT: {
        const { publicKey } = action;
        const privateKey = privateKeys[publicKey];
        actions.layer2libActions.init(publicKey, privateKey);
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
          }, 5000);
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
          firebase.listenOff(
            `agreementProposal/${account}`,
            actions.gameActions.updateProposal
          ),
          firebase.remove(`lobby/${account}`)
        ]);
      }
      case actionTypes.game.SET_LOBBY: {
        const { account } = getState().gameReducer;
        const { lobby } = action;
        const valid = [];
        // filter lobby users
        Object.keys(lobby || {}).forEach(publicKey => {
          const user = lobby[publicKey];

          if (
            user.publicKey !== account &&
            user.timestamp > Date.now() - 10000
          ) {
            valid.push(user);
          }
        });

        action.lobby = valid;

        return next(action);
      }
      case actionTypes.game.UPDATE_PROPOSAL: {
        const { account } = getState().gameReducer;
        const { proposal } = action;

        if (proposal && proposal.agreement) {
          action.channelParty = (proposal.agreement.partyA === account) ?
            'B' : 'A';
        } else {
          action.channelParty = '';
        }

        return next(action);
      }
      default:
        return next(action);
    }
  };
}
