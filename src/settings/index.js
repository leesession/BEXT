export default {
  apiUrl: 'http://yoursite.com/api/',
};

const siteConfig = {
  siteName: 'BETX',
  siteIcon: 'BETX-logo-trans',
  footerText: 'BETX ©2018 All rights reserved',
  telegramANN: 'https://t.me/betxnotice',
  telegramZH: 'https://t.me/betxofficial',
  telegramEN: 'https://t.me/betxgroup',
  contactEmail: 'operation@betx.com',
  website: 'www.betx.com',
  medium: 'https://medium.com/betx',
  facebook: 'https://www.facebook.com/betxofficial',
  twitter: 'https://twitter.com/BmexOfficial',
  announcement: 'https://betxhelp.zendesk.com/hc/zh-cn/sections/360002532612-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83',
  terms: 'https://betxhelp.zendesk.com/hc/zh-cn/articles/360018256011',
  ethscan: 'https://rinkeby.etherscan.io/',
  bbs: 'https://bbs.betx.com/',
};

const appConfig = {
};

const parseConfig = {
  serverURL: 'http://localhost:1338/parse',
  appId: 'BETX-APP',
  javascriptKey: 'javascriptKey',
};

const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};

const language = 'chinese';

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
