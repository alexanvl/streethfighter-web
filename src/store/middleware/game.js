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
      default:
        return next(action);
    }
  };
}
