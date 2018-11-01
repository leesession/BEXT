import _ from 'lodash';
import { Map } from 'immutable';

import actions from './actions';

import Queue from '../../helpers/queue';
const { messageType } = actions;

function convertBetToJSON(bet) {
  return {
    id: bet.id,
    time: bet.createdAt,
    bettor: bet.get('bettor'),
    rollUnder: bet.get('rollUnder'),
    bet: bet.get('betAmount'),
    roll: bet.get('roll'),
    payout: bet.get('payout'),
  };
}
const initState = new Map({
  history: new Queue(),
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
    case actions.BET_OBJECT_CREATED:
      state.get('history').enq(convertBetToJSON(action.data));

      return state
        .set('refresh', !state.get('refresh'));

    case actions.BET_CHANNEL_UPDATE:
        console.log('BET_CHANNEL_UPDATE.payload', action.payload);
        break;
    default:
      return state;
  }
  return state;
}
