import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos, { format } from 'eosjs';
const EosApi = require('eosjs-api');

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins(new ScatterEOS());

const eosSettings = {
  testnet: {
    network: {
      blockchain: 'eos',
      protocol: 'https',
      host: 'api.jungle.alohaeos.com',
      port: 443,
      chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
    },
    endpoint: 'https://api.jungle.alohaeos.com:443',
  },
  mainnet: {
    network: {
      blockchain: 'eos',
      protocol: 'https',
      host: 'nodes.get-scatter.com',
      port: 443,
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    },
    endpoint: 'https://api.eosnewyork.io:443',
  },
};

const BETX_TOKEN_CONTRACT = 'thebetxtoken';
const BETX_DICE_CONTRACT = 'thebetxowner';

const network = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'nodes.get-scatter.com',
  port: 443,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};

class ScatterHelper {
  constructor() {
    console.log('ScatterHelper.constructor');

    this.env = 'mainnet';
    this.settings = eosSettings[this.env];
    this.readEos = EosApi({ httpEndpoint: this.settings.endpoint });
    this.Eos = Eos;

    this.connect();

    this.connect = this.connect.bind(this);
    this.getIdentity = this.getIdentity.bind(this);
    this.getEOSBalance = this.getEOSBalance.bind(this);
    this.getBETXBalance = this.getBETXBalance.bind(this);
    this.transfer = this.transfer.bind(this);
    this.handleScatterError = this.handleScatterError.bind(this);
  }

  static async createInstance() {
    const scatterHelper = new ScatterHelper();
    await scatterHelper.connect();

    console.log('ScatterHelper.createInstance.scatter', scatterHelper.scatter);
    return scatterHelper;
  }

  async connect() {
    const that = this;

    return ScatterJS.scatter.connect('betx.fun').then((connected) => {
    // User does not have Scatter Desktop, Mobile or Classic installed.
      if (!connected) {
        return false;
      }

      console.log('ScatterJS is connected!');
      that.scatter = ScatterJS.scatter;
      window.ScatterJS = null;
    });
  }

  getIdentity() {
    const {
      scatter, settings: { network }, Eos, connect,
    } = this;
    const that = this;

    if (_.isUndefined(scatter)) {
      connect();
      return Promise.reject('error.scatter.notconnected');
    }

    const requiredFields = { accounts: [network] };

    return scatter.getIdentity(requiredFields).then(() => {
      // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
      // the user for their account name beforehand. They could still give you a different account.
      that.account = scatter.identity.accounts.find((x) => x.blockchain === 'eos');

      // You can pass in any additional options you want into the eosjs reference.
      const eosOptions = { expireInSeconds: 60 };

      // Get a api reference to eosjs which you can use to sign transactions with a user's Scatter.
      that.api = scatter.eos(network, Eos, eosOptions);

      return Promise.resolve(that.account);
    });
  }

  transfer(params) {
    const { api, account } = this;

    const {
      bettor, betAmount, betAsset, rollUnder, referrer, seed,
    } = params;

    const amount = _.floor(betAmount, 4).toFixed(4);

    // Construct json params
    const options = {
      from: bettor,
      to: BETX_DICE_CONTRACT,
      quantity: `${amount} ${betAsset}`,
      memo: `${rollUnder}-${referrer}-${seed}`,
    };

    console.log('transfer.options', options);

    if (_.isUndefined(api)) {
      return Promise.reject('error.scatter.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transfer(options.from, options.to, options.quantity, options.memo, transactionOptions).then((trx) => {
      // That's it!
      console.log(`Transaction ID: ${trx.transaction_id}`);
    });
  }

  getEOSBalance(name) {
    const { readEos, Eos } = this;
    return readEos.getCurrencyBalance('eosio.token', name, 'EOS').then((result) => {
      if (!_.isEmpty(result)) {
        console.log('getEOSBalance.result', result);

        const balObj = Eos.modules.format.parseAsset(result[0]);
        if (balObj && balObj.amount) {
          return Promise.resolve(_.toNumber(balObj.amount));
        }
      }

      return Promise.resolve();
    });
  }

  getBETXBalance(name) {
    const { readEos, Eos } = this;
    return readEos.getCurrencyBalance(BETX_TOKEN_CONTRACT, name, 'BETX').then((result) => {
      if (!_.isEmpty(result)) {
        console.log('getBETXBalance.result', result);

        const balObj = Eos.modules.format.parseAsset(result[0]);
        if (balObj && balObj.amount) {
          return Promise.resolve(_.toNumber(balObj.amount));
        }
      }

      return Promise.resolve();
    });
  }

  handleScatterError(err) {
    let { message } = err;
    switch (err.code) {
      case 423: // Scatter is locked

        message = 'error.scatter.locked';
        console.log('Scatter is locked. Please unlock it and refresh the page.');
        break;

      default:
        console.error(message);
        break;
    }

    return Promise.resolve(message);
  }
}

// const scatterHelper = await ScatterHelper.createInstance();

// console.log("scatterHelper is ", scatterHelper);
export default new ScatterHelper();
