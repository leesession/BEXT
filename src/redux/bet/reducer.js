import _ from 'lodash';
import { Map } from 'immutable';

import actions from './actions';
import Queue from '../../helpers/queue';
import { appConfig } from '../../settings';
import ParseHelper from '../../helpers/parse';

const { parseBetReceipt } = ParseHelper;

const { messageType } = actions;

const initState = new Map({
  history: new Queue(appConfig.betHistoryMemorySize),
  refresh: false,
  dailyVolume: 0,
  allVolume: 0,
  betxStakeAmount: 0,
  betxCirculation: 0,
  currentBets: [],
});

/**
 * Create or update a bet out of Bet history
 * @param  {[type]} betQueue [description]
 * @param  {[type]} newBet  [description]
 * @return {boolean}        True if bet history array is updated
 */
function CreateOrUpdateBetInHistory(betQueue, newBet) {
  if (_.isUndefined(newBet)) {
    console.log(`CreateOrUpdateBetInHistory: newBet is ${newBet}`);
    return false;
  }

  const existingBet = _.find(betQueue.all(), { id: newBet.id });

  // Return early if an existing bet is resolved
  if (!_.isUndefined(existingBet) && existingBet.isResolved) {
    return false;
  }

  // Create an object and enqueue if no match is found
  if (_.isUndefined(existingBet)) {
    betQueue.enq(newBet);
  } else {
    _.extend(existingBet, newBet);
  }

  return true;
}

/**
 * Create or update currentBets array for UI update
 * @param {[type]} currentBets [description]
 * @param {[type]} newBet      [description]
 * @return {boolean}        True if match is found and updated
 */
function updateCurrentBets(currentBets, newBet) {
  if (_.isUndefined(newBet)) {
    console.log(`CreateOrUpdateCurrentBet: newBet is ${newBet}`);
    return false;
  }

  const matchInCurrentBets = _.find(currentBets, { transactionId: newBet.transferTx });

  // Return early if an existing bet is resolved
  if (_.isUndefined(matchInCurrentBets)) {
    return false;
  } else if (matchInCurrentBets.isResolved) {
    return false;
  }
  matchInCurrentBets.isResolved = true;
  matchInCurrentBets.payout = newBet.payout;
  matchInCurrentBets.roll = newBet.roll;
  matchInCurrentBets.isWon = newBet.roll < newBet.rollUnder;

  return true;
}

export default function (state = initState, action) {
  switch (action.type) {
    case actions.INIT_SOCKET_CONNECTION_BET:

      return state
        .set('refresh', !state.get('refresh'));
    // case actions.SUBSCRIPTION_OPENED:
    //   console.log('reducer.SUBSCRIPTION_OPENED');
    //   break;
    // case actions.SUBSCRIPTION_CLOSED:
    //   console.log('reducer.SUBSCRIPTION_CLOSED');
    //   break;
    case actions.FETCH_BET_HISTORY_RESULT:
    {
      const items = action.value;
      _.each(items, (item) => {
        state.get('history').enq(item);
      });

      return state
        .set('refresh', !state.get('refresh'));
    }
    case actions.BET_OBJECT_CREATED:
    case actions.BET_OBJECT_UPDATED:
    {
      // console.log('Raw new bet: ', action.data);
      const newBet = parseBetReceipt(action.data);
      let needRefresh = false;

      // Update bet history table
      if (CreateOrUpdateBetInHistory(state.get('history'), newBet)) {
        needRefresh = true;
      }

      // Update bet history table
      if (updateCurrentBets(state.get('currentBets'), newBet)) {
        needRefresh = true;
      }

      if (needRefresh) {
        return state
          .set('refresh', !state.get('refresh'));
      }

      break;
    }
    case actions.BET_CHANNEL_UPDATE:
      break;
    case actions.GET_BET_VOLUME_RESULT:
      return state.set('dailyVolume', (action.value && action.value.day) || 0)
        .set('allVolume', (action.value && action.value.all) || 0);
    case actions.GET_BETX_STAKE_AMOUNT_RESULT:
      return state.set('betxStakeAmount', (action.value && action.value.staked) || 0)
        .set('betxCirculation', (action.value && action.value.issued) || 0);

    case actions.ADD_CURRENT_BET:
    {
      const { transactionId } = action.value;

      if (_.isUndefined(_.find(state.get('currentBets'), { transactionId }))) {
        state.get('currentBets').push(action.value);

        return state
          .set('refresh', !state.get('refresh'));
      }

      break;
    }
    case actions.DELETE_CURRENT_BET:
    {
      const transactionId = action.value;

      // Update notification component
      const removedElements = _.remove(state.get('currentBets'), { transactionId });

      if (!_.isEmpty(removedElements)) {
        return state
          .set('refresh', !state.get('refresh'));
      }
      break;
    }
    default:
      return state;
  }
  return state;
}
