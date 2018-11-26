export default {
  apiUrl: 'http://yoursite.com/api/',
};

const siteConfig = {
  siteName: 'BETX',
  siteIcon: 'BETX-logo-trans',
  footerText: 'BETX ©2018 All rights reserved',

  twitter: 'https://twitter.com/therealbetx',
  wechatQR: 'qr-wechat-betx',
  telegramZH: 'https://t.me/betxofficial',
  telegramEN: 'https://t.me/betxgroup',

  telegramANN: 'https://t.me/betxnotice',
  contactEmail: 'contact@betx.fun',
  website: 'www.betx.fun',
  medium: 'https://medium.com/betx',
  facebook: 'https://www.facebook.com/betxofficial',
  announcement: 'https://betxhelp.zendesk.com/hc/zh-cn/sections/360002532612-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83',
  terms: 'https://betxhelp.zendesk.com/hc/zh-cn/articles/360018256011',
  ethscan: 'https://rinkeby.etherscan.io/',
};

const appConfig = {
  firstBetReward: 300,
  betHistoryMemorySize: 500,
  betHistoryTableSize: 20,
  hugeBetAmount: 1000,
  chatHistoryMemorySize: 500,
  dividendRatio: 0.01,  // Dividend ratio compared to betVolume
  eosNetwork: {
    blockchain: 'eos',
    protocol: 'https',
    host: 'eos.greymass.com',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  },
};

const parseConfig = {
  serverURL: 'http://localhost:1338/parse',
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
