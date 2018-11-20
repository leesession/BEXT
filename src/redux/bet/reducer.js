import _ from 'lodash';
import { Map } from 'immutable';
import Eos from 'eosjs';

import actions from './actions';
import Queue from '../../helpers/queue';
import { appConfig } from '../../settings';
import ParseHelper from '../../helpers/parse';

const { parseBetReceipt } = ParseHelper;

const { messageType } = actions;

const initState = new Map({
  history: new Queue(appConfig.betHistoryMemorySize),
  refresh: false,
});

export default function (state = initState, action) {
  switch (action.type) {
    case actions.INIT_SOCKET_CONNECTION_BET:
      console.log('betReducer.INIT_SOCKET_CONNECTION_BET');

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
      if (newObject && _.isUndefined(_.find(state.get('history').all(), {id: newObject.id}))) {
        state.get('history').enq(newObject);

        return state
          .set('refresh', !state.get('refresh'));
      }

      break;
    }
    case actions.BET_OBJECT_UPDATED:
    {
      const newObject = parseBetReceipt(action.data);

      // Deduping - If newObject is legit and not contained in the queue
      if (newObject && _.isUndefined(_.find(state.get('history').all(), {id: newObject.id}))) {
        state.get('history').enq(newObject);

        return state
          .set('refresh', !state.get('refresh'));
      }

      break;
    }
    case actions.BET_CHANNEL_UPDATE:
      console.log('BET_CHANNEL_UPDATE.payload', action.payload);
      break;
    default:
      return state;
  }
  return state;
}
