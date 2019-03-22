import lianjinshu from '../../image/partner/lianjinshu.png';
import bitpie from '../../image/partner/bitpie.png';
import buckWallet from '../../image/partner/buck_wallet.png';
import dexeo from '../../image/partner/dexeo.svg';
import findex from '../../image/partner/findex.png';
import maizi from '../../image/partner/maizi.svg';
import prochain from '../../image/partner/prochain.png';
import secrypto from '../../image/partner/secrypto.png';
import tokenPocket from '../../image/partner/TP.png';
import dappradar from '../../image/partner/dappradar.png';
import dappreview from '../../image/partner/dappreview.svg';
import spiderstore from '../../image/partner/spiderstore.svg';
import meet from '../../image/partner/meet.png';
import newdex from '../../image/partner/newdex.png';

// EOS钱包
const partner_package=[
    {
        name:'Token Pocket',intro:'TokenPocket是一款支持多代币，多底层的通用数字货币钱包',
        src:tokenPocket,link:'https://www.tokenpocket.pro/'
    },
    {
        name:'Meetone',intro:'MEET.ONE是一个钱包界面清新，生态布局全面的钱包',
        src:meet,link:'https://meet.one/'
    },
    {
        name:'Bitpie',intro:'比特派是一款多链钱包，支持 BTC/ETH/EOS/USDT 等多种区块链资产',
        src:bitpie,link:'https://bitpie.com/'
    },
    {
        name:'Secrypto',intro:'Secrypto is a secure and easy-to-use crypto wallet. Secrypto provides an intuitive yet secured wallet for every user from beginner to expert',
        src:secrypto,link:'https://www.secrypto.io/'
    },
    {
        name:'麦子钱包',intro:'第一个同时支持ETH系、NEO系、EOS系Token的数字钱包. 安全保障. 全球第一个使用智能合约提供安全保障的钱包',
        src:maizi,link:'http://www.mathwallet.org/cn/'
    },
    {
        name:'BuckWallet',intro:'公鹿钱包是一款支持多账户管理、常用转账记录簿、指纹支付的Eos钱包',
        src:buckWallet,link:'https://bw.blockdog.com/'
    },
];
// Eos信息平台：
const partner_message=[
    {
        name:'炼金术',intro:'一个链接区块链爱好者和项目方的桥梁，方便区块链爱好者更快了解项目动态的信息渠道',
        src:lianjinshu,link:'http://www.lianjinshu.com/'
    },
    {
        name:'DappRadar',intro:'Ranked list of Blockchain',
        src:dappradar,link:'https://dappradar.com/'
    },
    {
        name:'Spider Store',intro:'挖掘优质Dapp平台',
        src:spiderstore,link:'https://spider.store/'
    },
    {
        name:'DappReviw',intro:'Deliver Dapp Data,User insights and market analytics',
        src:dappreview,link:'https://dapp.review/'
    },
    {
        name:'Prochain',intro:'基于Eos的首款糖果盒子',
        src:prochain,link:'https://chain.pro/'
    },
]
// 交易所：
const partner_exchange=[
    {
        name:'Newdex',intro:'全球首家EOS去中心化交易所',
        src:newdex,link:'https://newdex.io/'
    },
    {
        name:'Dexeos',intro:'The World’s First EOS-based Decentralized Exchange',
        src:dexeo,link:'https://dexeos.io/'
    },
    {
        name:'Findex',intro:'A decentralized exchange built for Eos community',
        src:findex,link:'https://findex.pro/'
    },
]
const partner={partner_package,partner_message,partner_exchange}

export default partner;
