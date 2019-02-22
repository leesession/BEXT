/* eslint prefer-promise-reject-errors: 0, no-param-reassign: */
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import _ from 'lodash';
import Eosjs from 'eosjs';
import { appConfig } from '../settings';
import { parseAsset } from './utility';
const EosApi = require('eosjs-api');

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins(new ScatterEOS());

const BETX_TOKEN_CONTRACT = 'thebetxtoken';
const BETX_DICE_CONTRACT = 'thebetxowner';
const BETX_DIVID_CONTRACT = 'thebetxdivid';
const BETX_AWARD_CONTRACT = 'thebetxaward';

class ScatterHelper {
  constructor() {
    this.network = appConfig.eosNetwork;
    this.readEos = EosApi({ httpEndpoint: `${this.network.protocol}://${this.network.host}:${this.network.port}` });
    this.Eos = Eosjs;

    this.connect();

    this.connect = this.connect.bind(this);
    this.getIdentity = this.getIdentity.bind(this);
    this.logout = this.logout.bind(this);
    this.transfer = this.transfer.bind(this);
    this.handleScatterError = this.handleScatterError.bind(this);
    this.getAccount = this.getAccount.bind(this);
    this.getTotalBetAmount = this.getTotalBetAmount.bind(this);
    this.stake = this.stake.bind(this);
    this.unstake = this.unstake.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.getMyStakeAndDividend = this.getMyStakeAndDividend.bind(this);
    this.claimDividend = this.claimDividend.bind(this);
    this.getCurrencyBalance = this.getCurrencyBalance.bind(this);
    this.getRedeemTable = this.getRedeemTable.bind(this);
    this.claimBuyback = this.claimBuyback.bind(this);
  }

  async connect() {
    const { eosNetwork } = this;
    const that = this;

    const connectionOptions = {
      network: eosNetwork,
      initTimeout: 10000,
    };

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
      return Promise.reject('error.plugin.notconnected');
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
      bettor, betAmount, betAsset, rollUnder, referrer, seed, contract, precision,
    } = params;

    const amount = _.floor(betAmount, precision).toFixed(precision);

    // Construct json params
    const data = {
      from: bettor,
      to: BETX_DICE_CONTRACT,
      quantity: `${amount} ${betAsset}`,
      memo: `${rollUnder}-${referrer || 'betxresolver'}-${seed}`,
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.plugin.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(contract, (contractObj) =>
      contractObj.transfer(data, transactionOptions));
  }

  getAccount(name) {
    const { readEos } = this;
    return readEos.getAccount(name).then((result) => Promise.resolve({
      eosBalance: _.toNumber(parseAsset(result.core_liquid_balance).amount),
      cpuUsage: result.cpu_limit.used / result.cpu_limit.max,
      netUsage: result.net_limit.used / result.net_limit.max,
    }));
  }

  getCurrencyBalance(params) {
    const { name, contract, symbol } = params;
    const { readEos } = this;

    return readEos.getCurrencyBalance(contract, name, symbol).then((result) => {
      if (!_.isEmpty(result)) {
        const balObj = parseAsset(result[0]);
        if (balObj && balObj.amount) {
          return Promise.resolve(_.toNumber(balObj.amount));
        }
      }
      return Promise.resolve(0);
    });
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
      return Promise.reject('error.plugin.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_TOKEN_CONTRACT, (contract) =>
      contract.transfer(data, transactionOptions));
  }

  unstake(params) {
    const { api, account } = this;

    const {
      quantity, username, speed,
    } = params;

    if (_.isUndefined(username)) {
      throw new Error('message.warn.loginFirst');
    }

    // Construct json params
    const data = {
      user: username,
      unstakeAsset: quantity,
      speed,
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.plugin.notAuthenticated');
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

      // Format numbers from 100000 to 10
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

  getRedeemTable() {
    const { readEos } = this;

    const options = {
      json: true,
      code: BETX_AWARD_CONTRACT,
      scope: BETX_AWARD_CONTRACT,
      table: 'redeems',
      limit: 100,
    };

    return readEos.getTableRows(options).then((result) => {
      const rows = result && result.rows;

      let results = _.orderBy(rows, ['id'], ['desc']);

      results = results.slice(0, 3);

      _.each(results, (row) => {
        try {
          row.candidateNum = row.candidates === '' ? 0 : row.candidates.split(',').length;
        } catch (err) {
          row.candidateNum = 0;
        }

        row.totalEOS = _.floor((row.total / 100000000) * row.ratio, 2);
        row.availableEOS = _.floor((row.available / 100000000) * row.ratio, 2);
      });

      return Promise.resolve(results);
    });
  }

  claimBuyback(params) {
    const { api, account } = this;

    const {
      username, quantity, redeemIndex,
    } = params;

    if (_.isUndefined(api)) {
      return Promise.reject('error.plugin.notAuthenticated');
    }

    if (_.isUndefined(username)) {
      return Promise.reject('error.plugin.invalidUsername');
    }

    // Construct json params
    const data = {
      from: username,
      to: BETX_AWARD_CONTRACT,
      quantity,
      memo: redeemIndex,
    };

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_TOKEN_CONTRACT, (contractObj) =>
      contractObj.transfer(data, transactionOptions));
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
      return Promise.reject('error.plugin.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_DIVID_CONTRACT, (contract) =>
      contract.claimdivid(data, transactionOptions));
  }

  withdraw(params) {
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
      withdrawAsset: quantity,
    };

    if (_.isUndefined(api)) {
      return Promise.reject('error.plugin.notAuthenticated');
    }

    // Never assume the account's permission/authority. Always take it from the returned account.
    const transactionOptions = { authorization: [`${account.name}@${account.authority}`] };

    return api.transaction(BETX_DIVID_CONTRACT, (contract) =>
      contract.withdraw(data, transactionOptions));
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
                return Promise.resolve('error.plugin.betLessThanMax');
              } else if (assertMessageObj.message.indexOf('overdrawn balance') >= 0 || assertMessageObj.message.indexOf('no balance object found') >= 0) {
                return Promise.resolve('error.plugin.overdrawnBalance');
              } else if (assertMessageObj.message.indexOf('duplicate transaction') >= 0) {
                return Promise.resolve('error.plugin.duplicateTransaction');
              } else if (assertMessageObj.message.indexOf('Stake must be greater than') >= 0) {
                return Promise.resolve('error.plugin.stakeGreater');
              } else if (assertMessageObj.message.indexOf('Withdraw amount has to be positive') >= 0) {
                return Promise.resolve('error.plugin.withdrawAmountInvalid');
              }
              return Promise.resolve(_.trimStart(assertMessageObj.message, 'assertion failure with message: '));
            }
          }
        }
      } catch (parseError) {
        // 2. Plain str case such ass "error.plugin.blabla"
        // TODO: need to format all errors in this function
        return Promise.resolve(err);
      }
    }

    switch (code) {
      case 402: // Scatter is locked
        message = 'error.plugin.rejected';
        break;

      case 423: // Scatter is locked
        message = 'error.plugin.locked';
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

export default new ScatterHelper();
