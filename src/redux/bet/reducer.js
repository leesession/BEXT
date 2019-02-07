import _ from 'lodash';
import { Map } from 'immutable';
import moment from 'moment';

import actions from './actions';
import appActions from '../app/actions';
import { appConfig } from '../../settings';
import ParseHelper from '../../helpers/parse';
import { enqueue } from '../../helpers/utility';

const { parseBetReceipt } = ParseHelper;

const initState = new Map({
  history: [],
  myHistory: [],
  hugeHistory: [],
  refresh: false,
  dailyVolume: 0,
  allVolume: 0,
  betxStakeAmount: 0,
  betxCirculation: 0,
  currentBets: [],
  betRank: undefined,
  username: undefined,
  selectedSymbol: 'EOS',
  pendingBet: undefined,
});

/**
 * Create or update a bet out of Bet history
 * @param  {[type]} betQueue [description]
 * @param  {[type]} newBet  [description]
 * @return {boolean}        True if bet history array is updated
 */
function CreateOrUpdateBetInHistory(existingList, newBet) {
  if (_.isUndefined(newBet)) {
    return false;
  }

  const existingBet = _.find(existingList, { key: newBet.key });

  // Return early if an existing bet is resolved
  if (!_.isUndefined(existingBet) && existingBet.isResolved) {
    return false;
  }

  // Create an object and enqueue if no match is found
  if (_.isUndefined(existingBet)) {
    enqueue(existingList, newBet, appConfig.betHistoryMemorySize);
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
function getUpdatedPendingBet(oldPendingBet, newBet) {
  const pendingBet = oldPendingBet;

  // This function should be used to update an existing pendingBet, neither pendingBet nor newBet should be undefined
  if (_.isUndefined(newBet) || _.isUndefined(oldPendingBet)) {
    return undefined;
  }

  if (pendingBet.transactionId !== newBet.transferTx) { // Not the bet we are waiting for response for
    return undefined;
  }

  if (!newBet.isResolved) { // The pending bet not resolved yet
    return undefined;
  }

  pendingBet.payout = newBet.payout;
  pendingBet.roll = newBet.roll;
  pendingBet.isWon = newBet.roll < newBet.rollUnder;
  pendingBet.isResolved = newBet.isResolved;
  pendingBet.status = newBet.status;
  pendingBet.createdAt = newBet.createdAt;
  pendingBet.endTime = newBet.endTime;

  return pendingBet;
}

export default function (state = initState, action) {
  switch (action.type) {
    case actions.INIT_SOCKET_CONNECTION_BET:

      return state
        .set('refresh', !state.get('refresh'));
    case appActions.GET_USERNAME_RESULT:
      return state.set('username', action.value);
    case actions.FETCH_BET_HISTORY_RESULT:
    {
      return state.set('history', action.value)
        .set('refresh', !state.get('refresh'));
    }
    case actions.FETCH_MY_BET_HISTORY_RESULT:
    {
      return state.set('myHistory', action.value)
        .set('refresh', !state.get('refresh'));
    }
    case actions.FETCH_HUGE_BET_HISTORY_RESULT:
    {
      return state.set('hugeHistory', action.value)
        .set('refresh', !state.get('refresh'));
    }
    case actions.BET_OBJECT_CREATED:
    case actions.BET_OBJECT_UPDATED:
    {
      const newBet = parseBetReceipt(action.data);
      let needRefresh = false;

      // Update bet history table
      const history = state.get('history');

      if (CreateOrUpdateBetInHistory(history, newBet)) {
        state.set('history', history);

        if (newBet.bettor === state.get('username')) {
          state.set('myHistory', enqueue(state.get('myHistory'), newBet, appConfig.betHistoryMemorySize));
        }

        // Only add bet over than appConfig.hugeBetAmount to huge bet table
        if (newBet.payoutAsset && newBet.payoutAsset.symbol === state.get('selectedSymbol') && newBet.payoutAsset.amount >= appConfig.hugeBetAmount) {
          state.set('hugeHistory', enqueue(state.get('hugeHistory'), newBet, appConfig.betHistoryMemorySize));
        }

        needRefresh = true;
      }

      const updatedPendingBet = getUpdatedPendingBet(state.get('pendingBet'), newBet);
      if (!_.isUndefined(updatedPendingBet)) {
        state.set('pendingBet', updatedPendingBet);
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

    case actions.SET_PENDING_BET:
      return state.set('pendingBet', action.value);
    case actions.RESET_PENDING_BET:
      return state.set('pendingBet', undefined);
    case actions.BET_RANK_RESULT:
      return state.set('betRank', action.value)
        .set('refresh', !state.get('refresh'));
    case actions.SET_CURRENCY:
      return state.set('selectedSymbol', action.value);
    default:
      return state;
  }
  return state;
}
