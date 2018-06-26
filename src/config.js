
const GAME_DATA = {
  fighters: [
    { name: 'Vitalik', },
    { name: 'Satoshi', }
  ],
  initialGameState: {
    turn: 'B',
    isMyTurn: false,
    lastMove: 0,
    lastDamage: 0,
    lastRand: 0,
    history: [],
    startHealth: 2000,
  },
  keys: {
    punch: 80, // p
    kick: 75, // k
    super: 83 // s
  },
  characterStates: {
    punch: 0,
    kick: 1,
    idle: 2,
    super: 3,
  }
};

const dev = {
  WEB3_URL: 'http://localhost:8545',
  PRIVATE_KEYS: {
    '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1': '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
    '0xffcf8fdee72ac11b5c542428b35eef5769c409f0': '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
    '0x22d491bde2303f2f43325b2108d26f1eaba1e32b': '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c'
  },
  GAME_DATA
};

const prod = {
  WEB3_URL: 'https://rinkeby.infura.io',
  PRIVATE_KEYS: {
    '0x1e8524370B7cAf8dC62E3eFfBcA04cCc8e493FfE': '0x2c339e1afdbfd0b724a4793bf73ec3a4c235cceb131dcd60824a06cefbef9875',
    '0x4c88305c5f9e4feb390e6ba73aaef4c64284b7bc': '0xaee55c1744171b2d3fedbbc885a615b190d3dd7e79d56e520a917a95f8a26579',
    '0xd4EA3b21C312D7C6a1c744927a6F80Fe226A8416': '0x9eb0e84b7cadfcbbec8d49ae7112b25e0c1cb158ecd2160c301afa1f4a1029c8'
  },
  GAME_DATA
};

const config = process.env.NODE_ENV === 'production'
  ? prod
  : dev;

export default {
  ...config
};