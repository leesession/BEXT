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

    const that = this;
    that.env = 'mainnet';
    that.settings = eosSettings[that.env];
    that.readEos = EosApi({ httpEndpoint: that.settings.endpoint });
    that.Eos = Eos;

    // Connect to scatter
    ScatterJS.scatter.connect('betx.fun').then((connected) => {
    // User does not have Scatter Desktop, Mobile or Classic installed.
      if (!connected) {
        return false;
      }

      console.log('ScatterJS is connected!');
      that.scatter = ScatterJS.scatter;
      window.ScatterJS = null;

      return Promise.resolve();
    }, (error) => {
      that.handleScatterError(error);
    });

    this.getIdentity = this.getIdentity.bind(this);
    this.getEOSBalance = this.getEOSBalance.bind(this);
    this.getBETXBalance = this.getBETXBalance.bind(this);
    this.handleScatterError = this.handleScatterError.bind(this);
  }

  getIdentity() {
    const { scatter, settings: { network }, Eos } = this;
    const that = this;

    if (_.isUndefined(scatter)) {
      throw Error('scatter not connected yet.');
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

  transfer() {
    const { api, account } = this;

    if (_.isUndefined(api)) {
      throw Error('Scatter is not authenticated yet.');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transfer(account.name, 'helloworld', '1.0000 EOS', 'memo', transactionOptions).then((trx) => {
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

  getBETXBalance() {

  }

  handleScatterError(err) {
    switch (err.code) {
      case 423: // Scatter is locked
        console.log('Scatter is locked. Please unlock it and refresh the page.');
        break;

      default:
        console.error(err.message);
        break;
    }
  }
}

export default new ScatterHelper();
