/* eslint prefer-promise-reject-errors: 0 */
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import _ from 'lodash';
import Eosjs from 'eosjs';
import { appConfig } from '../settings';
const EosApi = require('eosjs-api');

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins(new ScatterEOS());

const BETX_TOKEN_CONTRACT = 'thebetxtoken';
const BETX_DICE_CONTRACT = 'thebetxowner';
const EOS_TOKEN_CONTRACT = 'eosio.token';
const BETX_DIVID_CONTRACT = 'thebetxdivid';

// Same constants as contracts
const GLOBAL_ID_UNSTAKE_REQUEST = 1;
const GLOBAL_ID_NEW_DIVIDEND = 2;
const GLOBAL_ID_STAKE_TOTAL = 3;
const GLOBAL_ID_CLAIM_ENABLED = 4;

const INITAL_OWNER_BETX_BALANCE = 6600000000 * 0.9;

class ScatterHelper {
  constructor() {
    this.network = appConfig.eosNetwork;
    this.readEos = EosApi({ httpEndpoint: `${this.network.protocol}://${this.network.host}:${this.network.port}` });
    this.Eos = Eosjs;

    this.connect();

    this.connect = this.connect.bind(this);
    this.getIdentity = this.getIdentity.bind(this);
    this.logout = this.logout.bind(this);
    this.getEOSBalance = this.getEOSBalance.bind(this);
    this.getBETXBalance = this.getBETXBalance.bind(this);
    this.transfer = this.transfer.bind(this);
    this.handleScatterError = this.handleScatterError.bind(this);
    this.parseAsset = this.parseAsset.bind(this);
    this.getAccount = this.getAccount.bind(this);
    this.getTotalBetAmount = this.getTotalBetAmount.bind(this);
    this.stake = this.stake.bind(this);
    this.unstake = this.unstake.bind(this);
    this.getMyStakeAndDividend = this.getMyStakeAndDividend.bind(this);
    this.getContractSnapshot = this.getContractSnapshot.bind(this);
    this.getContractStakeAndDividend = this.getContractStakeAndDividend.bind(this);
    this.getBETXCirculation = this.getBETXCirculation.bind(this);
    this.claimDividend = this.claimDividend.bind(this);
  }

  // static async createInstance() {
  //   const scatterHelper = new ScatterHelper();
  //   await scatterHelper.connect();

  //   return scatterHelper;
  // }

  async connect() {
    const that = this;

    const connectionOptions = { initTimeout: 10000 };

    return ScatterJS.scatter.connect('betx.fun', connectionOptions).then((connected) => {
    // User does not have Scatter Desktop, Mobile or Classic installed.
      if (!connected) {
        return false;
      }

      that.scatter = ScatterJS.scatter;
      window.ScatterJS = null;

      return Promise.resolve();
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

  logout() {
    const { scatter } = this;
    return scatter.forgetIdentity();
  }

  transfer(params) {
    const { api, account } = this;

    const {
      bettor, betAmount, betAsset, rollUnder, referrer, seed,
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

  getAccount(name) {
    const { readEos, Eos } = this;
    return readEos.getAccount(name).then((result) => Promise.resolve({
      eosBalance: _.toNumber(Eos.modules.format.parseAsset(result.core_liquid_balance).amount),
      cpuUsage: result.cpu_limit.used / result.cpu_limit.max,
      netUsage: result.net_limit.used / result.net_limit.max,
    }));
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

  parseAsset(quantity) {
    const { Eos } = this;

    return Eos.modules.format.parseAsset(quantity);
  }

  getTotalBetAmount() {
    const { readEos } = this;

    const json = true;
    const code = BETX_DICE_CONTRACT;
    const scope = BETX_DICE_CONTRACT;
    const table = 'globalvars';

    return readEos.getTableRows(json, code, scope, table).then((result) => {
      const rows = result && result.rows;

      const betAmountVar = _.find(rows, { id: 2 });

      if (_.isUndefined(betAmountVar)) {
        return Promise.resolve(0);
      }

      return Promise.resolve(_.floor(betAmountVar.val / 1000000, 2));
    });
  }

  stake(params) {
    const { api, account } = this;

    const {
      quantity, username,
    } = params;

    if (_.isUndefined(username)) {
      throw new Error('message.warn.loginFirst');
    }

    // Construct json params
    const data = {
      from: username,
      to: BETX_DIVID_CONTRACT,
      quantity,
      memo: 'betx.fun stake',
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.scatter.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_TOKEN_CONTRACT, (contract) =>
      contract.transfer(data, transactionOptions));
  }

  unstake(params) {
    const { api, account } = this;

    const {
      quantity, username,
    } = params;

    if (_.isUndefined(username)) {
      throw new Error('message.warn.loginFirst');
    }

    // Construct json params
    const data = {
      user: username,
      unstakeAsset: quantity,
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.scatter.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_DIVID_CONTRACT, (contract) =>
      contract.unstake(data, transactionOptions));
  }

  getMyStakeAndDividend(username) {
    const { readEos } = this;

    const options = {
      json: true,
      code: BETX_DIVID_CONTRACT,
      scope: BETX_DIVID_CONTRACT,
      table: 'stakers',
      limit: 1000,
    };

    return readEos.getTableRows(options).then((result) => {
      const rows = result && result.rows;
      const matchRow = _.find(rows, { name: username });

      const returnResult = {
        stake: 0,
        frozen: 0,
        available: 0,

        ssTotal: 0,
        ssEffective: 0,
        ssCount: 0,
        dividend: 0,
      };

      if (_.isUndefined(matchRow)) {
        return Promise.resolve(returnResult);
      }

      _.each(returnResult, (value, key) => {
        if (key === 'ssCount') {
          returnResult[key] = matchRow[key];
        } else {
          returnResult[key] = (1.0 * matchRow[key]) / 10000;
        }
      });

      return Promise.resolve(returnResult);
    });
  }

  getContractSnapshot() {
    const { readEos } = this;

    const options = {
      json: true,
      code: BETX_DIVID_CONTRACT,
      scope: BETX_DIVID_CONTRACT,
      table: 'snapshots',
      limit: 1000,
    };

    return readEos.getTableRows(options).then((result) => {
      const rows = result && result.rows;
      const lastRow = _.last(rows);

      const returnResult = {
        total: 0,
        effective: 0,
        eosBalance: 0,
        betxBalance: 0,
        userCount: 0,
      };

      if (_.isUndefined(lastRow)) {
        return Promise.resolve(returnResult);
      }

      _.each(returnResult, (value, key) => {
        if (key === 'userCount') {
          returnResult[key] = lastRow[key];
        } else {
          returnResult[key] = (1.0 * lastRow[key]) / 10000;
        }
      });

      return Promise.resolve(returnResult);
    });
  }

  getContractStakeAndDividend() {
    const { readEos } = this;

    const options = {
      json: true,
      code: BETX_DIVID_CONTRACT,
      scope: BETX_DIVID_CONTRACT,
      table: 'globalvars',
    };

    return readEos.getTableRows(options).then((result) => {
      console.log(result);

      const rows = result && result.rows;

      const returnResult = {
        stake: 0,
        dividend: 0,
      };

      _.each(rows, (row) => {
        if (row.id === GLOBAL_ID_STAKE_TOTAL) {
          returnResult.stake = (1.0 * row.val) / 10000;
        } else if (row.id === GLOBAL_ID_NEW_DIVIDEND) {
          returnResult.dividend = (1.0 * row.val) / 10000;
        }
      });

      return Promise.resolve(returnResult);
    });
  }

  /**
 * Get BETX circulation, done by deduct currency thebetxowner balance from initial balance
 * @return {[type]} [description]
 */
  getBETXCirculation() {
    const { readEos, parseAsset } = this;
    return readEos.getCurrencyBalance(BETX_TOKEN_CONTRACT, BETX_DICE_CONTRACT, 'BETX').then((result) => {
      if (!_.isEmpty(result)) {
        const balObj = parseAsset(result[0]);
        if (balObj && balObj.amount) {
          return Promise.resolve(INITAL_OWNER_BETX_BALANCE - _.toNumber(balObj.amount));
        }
      }
      return Promise.resolve(0);
    });
  }

  claimDividend(params) {
    const { api, account } = this;

    const {
      quantity, username,
    } = params;

    if (_.isUndefined(username)) {
      throw new Error('message.warn.loginFirst');
    }

    // Construct json params
    const data = {
      user: username,
      claimAsset: quantity,
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.scatter.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_DIVID_CONTRACT, (contract) =>
      contract.claimdivid(data, transactionOptions));
  }

  handleScatterError(err) {
    let { message, code } = err;

    if (_.isString(err)) {
      // 1. JSON response case
      try {
        const errObject = JSON.parse(err);

        if (_.isObject(errObject) && errObject.error) {
          const { code: errorCode } = errObject.error;
          code = errorCode;

          // Try to parse out assert message from details
          if (errObject.error.details) {
            const assertMessageObj = _.find(errObject.error.details, { method: 'eosio_assert' });

            if (assertMessageObj) {
              if (assertMessageObj.message.indexOf('Bet less than max') >= 0) {
                return Promise.resolve('error.scatter.betLessThanMax');
              } else if (assertMessageObj.message.indexOf('overdrawn balance') >= 0) {
                return Promise.resolve('error.scatter.overdrawnBalance');
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
