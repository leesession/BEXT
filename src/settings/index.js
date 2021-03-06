export default {
  apiUrl: 'http://yoursite.com/api/',
};

const siteConfig = {
  siteName: 'BETX',
  siteIcon: 'BETX-logo-trans',
  footerText: 'BETX ©2019 All rights reserved',

  twitter: 'https://twitter.com/therealbetx',
  wechatQR: 'qr-wechat-betx',
  telegramZH: 'https://t.me/betxofficial',
  telegramEN: 'https://t.me/betxgroup',

  telegramANN: 'https://t.me/betxnotice',
  contactEmail: 'contact@betx.fun',
  website: 'www.betx.fun',
  medium: 'https://medium.com/@betx',
  facebook: 'https://www.facebook.com/betxofficial',
  announcement: 'https://betxhelp.zendesk.com/hc/zh-cn/sections/360002532612-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83',
  terms: 'https://betxhelp.zendesk.com/hc/zh-cn/articles/360018256011',
  ethscan: 'https://rinkeby.etherscan.io/',
  fairnessVerificationUrl: 'https://github.com/TheBETX/tools.git',
};

const appConfig = {
  firstBetReward: 300,
  betHistoryMemorySize: 20,
  betHistoryTableSize: 20,
  betChannelReconnectInterval: 5000,
  hugeBetAmount: 250,
  chatHistoryMemorySize: 100,
  chatChannelReconnectInterval: 5000,
  dividendRatio: 0.01, // Dividend ratio compared to betVolume
  pollBetRankInterval: 5000, // Interval of which rank data polls
  eosNetwork: {
    blockchain: 'eos',
    protocol: 'https',
    host: 'proxy.eosnode.tools',
    port: 443,

    // protocol: 'http',
    // host: '127.0.0.1',
    // port: 7777,

    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  },
  cpuBankUrl: 'https://eoslaomao.com/bankofstaked?ref=betx.fun',
};

const parseConfig = {
  serverURL: 'https://betx.fun/parse',
  // serverURL: 'http://localhost:1338/parse',
  appId: 'BETX-APP',
  javascriptKey: 'betx-js-key',
};

const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};

const language = (window.navigator.userLanguage || window.navigator.language) === 'zh-CN' ? 'chinese' : 'english';

const infuraConfig = {
  wssEndpoint: 'wss://rinkeby.infura.io/ws',
  httpEndpoint: 'https://rinkeby.infura.io/v3/dd08fb3859de43f995f3f40088f6100c',
  apiKey: 'dd08fb3859de43f995f3f40088f6100c',
};

const coinbaseConfig = {
  apiKey: 'lWcOvqxD7EFVy6yY',
  apiSecret: 'x0U5AP6IfLkrml8QqRnTfDwtu1zkklO2',
  url: {
    exchangeRates: 'https://api.coinbase.com/v2/exchange-rates',
  },
};

export {
  siteConfig,
  appConfig,
  themeConfig,
  language,
  infuraConfig,
  coinbaseConfig,
  parseConfig,
};
