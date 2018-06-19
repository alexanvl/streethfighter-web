const dev = {
  WEB3_URL: 'http://localhost:8545',
  PRIVATE_KEYS: {
    '0xeec9a59e98423bc43e52f03cd7dff6cd1e3e0909': '0xea87ffe42f8dd0c5797796b6bc4bd01b2216e7d3c07d11e1b8fe19b73b421c26',
    '0x6a2e85deb7f909d579d75f2a10df677123eb5911': '0x0631aaa711c613264e6fbdd08d8d80c90918b2623e9e0d2dd5272d624a7c772e',
    '0xbae3d12ba9aaeed274b59b484023f5847f750990': '0x73ba3bb171fea9efe835077b226a4e2f7b5834ad2698d0dd1be1fae8a3d5ccf8'
  }
};

const prod = {
  WEB3_URL: 'https://rinkeby.infura.io',
  PRIVATE_KEYS: {
    '0x1e8524370B7cAf8dC62E3eFfBcA04cCc8e493FfE': '0x2c339e1afdbfd0b724a4793bf73ec3a4c235cceb131dcd60824a06cefbef9875',
    '0x4c88305c5f9e4feb390e6ba73aaef4c64284b7bc': '0xaee55c1744171b2d3fedbbc885a615b190d3dd7e79d56e520a917a95f8a26579',
    '0xd4EA3b21C312D7C6a1c744927a6F80Fe226A8416': '0x9eb0e84b7cadfcbbec8d49ae7112b25e0c1cb158ecd2160c301afa1f4a1029c8'
  }
};

const config = process.env.NODE_ENV === 'production'
  ? prod
  : dev;

export default {
  ...config
};