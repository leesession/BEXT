import Parse from 'parse';
import _ from 'lodash';
import moment from 'moment';

import { parseConfig, appConfig } from '../settings';
import { parseAsset, trimZerosFromAsset } from './utility';
import betActions from '../redux/bet/actions';

Parse.initialize(parseConfig.appId, parseConfig.javascriptKey, '0x2d2e81f6db11144f9a51c1bac41b4ebffecec391c19d74322b2a8917da357208');
Parse.serverURL = parseConfig.serverURL;
Parse.masterKey = '0x2d2e81f6db11144f9a51c1bac41b4ebffecec391c19d74322b2a8917da357208';

const ParseMessage = Parse.Object.extend('Message');
const ParseBet = Parse.Object.extend('Bet');

const STATUS = {
  NOT_STARTED: 'Not Started',
  RESOLVED: 'Resolved',
};

class ParseHelper {
  constructor() {
    this.parse = Parse;
    this.sendMessage = this.sendMessage.bind(this);
    this.fetchBetHistory = this.fetchBetHistory.bind(this);
    this.fetchChatHistory = this.fetchChatHistory.bind(this);
    this.handleParseError = this.handleParseError.bind(this);
    this.parseBetReceipt = this.parseBetReceipt.bind(this);
    this.getBetVolume = this.getBetVolume.bind(this);
    this.getBetxStakeAmount = this.getBetxStakeAmount.bind(this);
  }

  /**
   * Prepare receipt data for view to render
   * @param  {[type]} parseObject [description]
   * @return {[type]}             [description]
   */
  parseBetReceipt(parseObject) {
  // Skip any bet that doesn't have a receipt object
    if (parseObject.get('status') !== STATUS.RESOLVED) {
      return undefined;
    }

    const payoutAsset = parseObject.get('payoutAsset');
    const payout = (payoutAsset && payoutAsset.amount === 0) ? '' : trimZerosFromAsset(parseObject.get('payout'));
    const resolveTrxId = parseObject.get('t_id');

    return {
      id: parseObject.id,
      time: moment.utc(parseObject.get('resolved_block_time')).toDate(), // Convert server UTC time to local here
      bettor: parseObject.get('bettor'),
      rollUnder: parseObject.get('roll_under'),
      betAmount: trimZerosFromAsset(parseObject.get('bet_amt')),
      roll: parseObject.get('roll'),
      transferTx: parseObject.get('transferTx'),
      payout,
      payoutAsset,
      trxUrl: `https://eostracker.io/transactions/${parseObject.get('resolved_block_num')}/${resolveTrxId}`,
    };
  }

  // accepts chat payload object containing user1 and user2
  subscribe(collection) {
    const query = new Parse.Query(collection);
    const subscription = query.subscribe();
    return subscription;
  }

  // accepts chat payload object containing user1 and user2
  unsubscribe(subscription) {
    subscription.unsubscribe();
  }

  sendMessage(messageObj) {
    const message = new ParseMessage();
    message.set('type', 'user');
    message.set('username', messageObj.username);
    message.set('body', messageObj.body);

    return message.save({}, { useMasterKey: true });
  }

  /**
   * Fetch Bet history based on type and params
   * @param  {object} params [description]
   * @param  {string} type [description]
   * @param  {string} username effective when type equals to MY
   * @param  {number} limit The threshold across which a bet is treated as huge;effective when type equals to HUGE
   * @return {[type]}        [description]
   */
  fetchBetHistory(params = {}) {
    const { parseBetReceipt } = this;
    const {
      type, username, limit, symbol,
    } = params;
    const query = new Parse.Query(ParseBet);
    query.equalTo('status', STATUS.RESOLVED);
    query.descending('resolved_block_num');

    if (params.type === betActions.BET_HISTORY_TYPE.MY) {
      query.equalTo('bettor', username);
    } else if (params.type === betActions.BET_HISTORY_TYPE.HUGE) {
      query.greaterThanOrEqualTo('payoutAsset.amount', limit);
      query.equalTo('payoutAsset.symbol', symbol);
    }

    query.limit(appConfig.betHistoryMemorySize);

    // Bet history need to be inserted to the queue in ascending order, so we need to reserve the array here
    return query.find().then((results) => Promise.resolve(_.reverse(_.filter(
      _.map(results, (entry) => parseBetReceipt(entry)),
      (o) => !_.isUndefined(o)
    ))));
  }

  fetchChatHistory() {
    const query = new Parse.Query(ParseMessage);
    query.descending('updatedAt');
    query.limit(appConfig.chatHistoryMemorySize);

    // Chat history need to be inserted to the queue in ascending order, so we need to reserve the array here
    return query.find().then(((results) => Promise.resolve(_.reverse(results))));
  }

  getBetVolume() {
    return this.parse.Cloud.run('getBetVolume', { types: ['day', 'all'] });
  }

  getBetxStakeAmount() {
    return this.parse.Cloud.run('getBetxStakeAmount');
  }

  handleParseError(err) {
    const message = 'error.parse.default';

    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        // return Parse.User.logOut();
        // Other Parse API errors that you want to explicitly handle
        break;
      default:
        break;
    }

    return message;
  }
}


export default new ParseHelper();
