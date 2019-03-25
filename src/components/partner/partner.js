import PropTypes from 'prop-types';
// EOS钱包
const partnerPackage = [
  {
    name: 'Token Pocket',
    intro: 'TokenPocket是一款支持多代币，多底层的通用数字货币钱包',
    link: 'https://www.tokenpocket.pro/',
  },
  {
    name: 'Meetone',
    intro: 'MEET.ONE是一个钱包界面清新，生态布局全面的钱包',
    link: 'https://meet.one/',
  },
  {
    name: 'Bitpie',
    intro: '比特派是一款多链钱包，支持 BTC/ETH/EOS/USDT 等多种区块链资产',
    link: 'https://bitpie.com/',
  },
  {
    name: 'Secrypto',
    intro: 'Secrypto is a secure and easy-to-use crypto wallet. Secrypto provides an intuitive yet secured wallet for every user from beginner to expert',
    link: 'https://www.secrypto.io/',
  },
  {
    name: '麦子钱包',
    intro: '第一个同时支持ETH系、NEO系、EOS系Token的数字钱包. 安全保障. 全球第一个使用智能合约提供安全保障的钱包',
    link: 'http://www.mathwallet.org/cn/',
  },
  {
    name: 'BuckWallet',
    intro: '公鹿钱包是一款支持多账户管理、常用转账记录簿、指纹支付的Eos钱包',
    link: 'https://bw.blockdog.com/',
  },
];
// Eos信息平台：
const partnerMessage = [
  {
    name: '炼金术',
    intro: '一个链接区块链爱好者和项目方的桥梁，方便区块链爱好者更快了解项目动态的信息渠道',
    link: 'http://www.lianjinshu.com/',
  },
  {
    name: 'DappRadar',
    intro: 'Ranked list of Blockchain',
    link: 'https://dappradar.com/',
  },
  {
    name: 'Spider Store',
    intro: '挖掘优质Dapp平台',
    link: 'https://spider.store/',
  },
  {
    name: 'DappReviw',
    intro: 'Deliver Dapp Data,User insights and market analytics',
    link: 'https://dapp.review/',
  },
  {
    name: 'Prochain',
    intro: '基于Eos的首款糖果盒子',
    link: 'https://chain.pro/',
  },
];
// 交易所：
const partnerExchange = [
  {
    name: 'Newdex',
    intro: '全球首家EOS去中心化交易所',
    link: 'https://newdex.io/',
  },
  {
    name: 'Dexeos',
    intro: 'The World’s First EOS-based Decentralized Exchange',
    link: 'https://dexeos.io/',
  },
  {
    name: 'Findex',
    intro: 'A decentralized exchange built for Eos community',
    link: 'https://findex.pro/',
  },
];
const partner = { partnerPackage, partnerMessage, partnerExchange };


partner.propTypes = {
  partnerPackage: PropTypes.array,
  partnerMessage: PropTypes.array,
  partnerExchange: PropTypes.array,
};

export default partner;
