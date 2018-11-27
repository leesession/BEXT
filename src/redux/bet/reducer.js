import _ from 'lodash';
import { Map } from 'immutable';
import Eos from 'eosjs';

import actions from './actions';
import Queue from '../../helpers/queue';
import { appConfig } from '../../settings';
import ParseHelper from '../../helpers/parse';
import appReducer from '../app/reducer';

const { parseBetReceipt } = ParseHelper;

const { messageType } = actions;

const initState = new Map({
  history: new Queue(appConfig.betHistoryMemorySize),
  refresh: false,
  dailyVolume: 0,
  allVolume: 0,
  betxStakeAmount: 0,
  betxCirculation: 0,
  currentBet: undefined,
});

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
    {
      const newObject = parseBetReceipt(action.data);

      // Deduping - If newObject is legit and not contained in the queue
      if (newObject && _.isUndefined(_.find(state.get('history').all(), { id: newObject.id }))) {
        state.get('history').enq(newObject);

        // TODO: Correlate current bet with new bet
        // const currentBet = state.get('currentBet');

        return state
          .set('refresh', !state.get('refresh'));
      }

      break;
    }
    case actions.BET_OBJECT_UPDATED:
    {
      const newObject = parseBetReceipt(action.data);

      // Deduping - If newObject is legit and not contained in the queue
      if (newObject && _.isUndefined(_.find(state.get('history').all(), { id: newObject.id }))) {
        state.get('history').enq(newObject);

        // TODO: Correlate current bet with new bet
        // const currentBet = state.get('currentBet');

        return state
          .set('refresh', !state.get('refresh'));
      }

      break;
    }
    case actions.BET_CHANNEL_UPDATE:
      break;
    case actions.GET_BET_VOLUME_RESULT:
      return state.set('dailyVolume', action.value && action.value.day || 0)
        .set('allVolume', action.value && action.value.all || 0);
    case actions.GET_BETX_STAKE_AMOUNT_RESULT:
      return state.set('betxStakeAmount', action.value && action.value.staked || 0)
        .set('betxCirculation', action.value && action.value.issued || 0);
    case actions.SET_CURRENT_BET:
      return state.set('currentBet', action.value);
    default:
      return state;
  }
  return state;
}
