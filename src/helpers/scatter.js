import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import _ from 'lodash';
import Eos from 'eosjs';
import { appConfig } from '../settings';
const EosApi = require('eosjs-api');

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins(new ScatterEOS());

const BETX_TOKEN_CONTRACT = 'thebetxtoken';
const BETX_DICE_CONTRACT = 'thebetxowner';
const EOS_TOKEN_CONTRACT = 'eosio.token';

class ScatterHelper {
  constructor() {
    this.network = appConfig.eosNetwork;
    this.readEos = EosApi({ httpEndpoint: `${this.network.protocol}://${this.network.host}:${this.network.port}` });
    this.Eos = Eos;

    this.connect();

    this.connect = this.connect.bind(this);
    this.getIdentity = this.getIdentity.bind(this);
    this.getEOSBalance = this.getEOSBalance.bind(this);
    this.getBETXBalance = this.getBETXBalance.bind(this);
    this.transfer = this.transfer.bind(this);
    this.handleScatterError = this.handleScatterError.bind(this);
    this.parseAsset = this.parseAsset.bind(this);
    this.getAccount = this.getAccount.bind(this);
  }

  // static async createInstance() {
  //   const scatterHelper = new ScatterHelper();
  //   await scatterHelper.connect();

  //   return scatterHelper;
  // }

  async connect() {
    const that = this;

    const connectionOptions = {initTimeout:10000}

    return ScatterJS.scatter.connect('betx.fun',connectionOptions).then((connected) => {
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
      scatter, network, Eos, connect,
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
      bettor, betAmount, betAsset, rollUnder, referrer, seed, nonce,
    } = params;

    const amount = _.floor(betAmount, 4).toFixed(4);

    // Construct json params
    const data = {
      from: bettor,
      to: BETX_DICE_CONTRACT,
      quantity: `${amount} ${betAsset}`,
      memo: `${rollUnder}-${referrer}-${seed}`,
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.scatter.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(EOS_TOKEN_CONTRACT, (contract) =>
      contract.transfer(data, transactionOptions));
  }

  getAccount(name){
    const { readEos, Eos } = this;
    return readEos.getAccount(name).then((result) => {
      console.log(result);

      return Promise.resolve({
        eosBalance: _.toNumber(Eos.modules.format.parseAsset(result.core_liquid_balance).amount),
        cpuUsage: result.cpu_limit.used / result.cpu_limit.max,
        netUsage: result.net_limit.used / result.net_limit.max,
      });
    });
  }

  getEOSBalance(name) {
    const { readEos, Eos } = this;
    return readEos.getCurrencyBalance(EOS_TOKEN_CONTRACT, name, 'EOS').then((result) => {
      if (!_.isEmpty(result)) {
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
        const balObj = Eos.modules.format.parseAsset(result[0]);
        if (balObj && balObj.amount) {
          return Promise.resolve(_.toNumber(balObj.amount));
        }
      }

      return Promise.resolve();
    });
  }

  parseAsset(quantity){
    return Eos.modules.format.parseAsset(quantity);
  }

  handleScatterError(err) {
    let { message, code, error } = err;

    if (_.isString(err)) {
      // 1. JSON response case
      try {
        const errObject = JSON.parse(err);

        if (_.isObject(errObject) && errObject.error) {
          code = errObject.error.code;

          // Try to parse out assert message from details
          if(errObject.error.details){
            const assertMessageObj = _.find(errObject.error.details, {method: "eosio_assert"});

            if(assertMessageObj){

              if(assertMessageObj.message.indexOf("Bet less than max") >=0){
                return Promise.resolve("error.scatter.betLessThanMax");
              }
              else if(assertMessageObj.message.indexOf("overdrawn balance") >=0){
                return Promise.resolve("error.scatter.overdrawnBalance");
              }
            }
          }
        }
      } catch (parseError) {
        // 2. Plain str case such ass "error.scatter.blabla"
        // TODO: need to format all errors in this function
        return Promise.resolve(err);
      }
    }

    switch (code) {
      case 402: // Scatter is locked
        message = 'error.scatter.rejected';
        break;

      case 423: // Scatter is locked
        message = 'error.scatter.locked';
        break;

      case 3080004: // tx_cpu_usage_exceeded
        message = 'error.account.cpuInsufficient';
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
