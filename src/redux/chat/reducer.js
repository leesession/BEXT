import _ from 'lodash';
import { Map } from 'immutable';

import actions from './actions';

import Queue from '../../helpers/queue';
const { messageType } = actions;

function convertMessageToJSON(message) {
  return {
    id: message.id,
    type: message.get('type'),
    username: message.get('username'),
    body: message.get('body'),
  };
}


const initState = new Map({
  history: new Queue(),
  messageNum: 0,
  refresh: false,
});

export default function (state = initState, action) {
  switch (action.type) {
    case actions.INIT_SOCKET_CONNECTION_MESSAGE:

      return state
        .set('refresh', !state.get('refresh'));
    case actions.MESSAGE_OBJECT_CREATED:
      state.get('history').enq(convertMessageToJSON(action.data));

      return state
        .set('messageNum', state.get('state') + 1)
        .set('refresh', !state.get('refresh'));
    case actions.MESSAGE_CHANNEL_UPDATE:
      console.log('MESSAGE_CHANNEL_UPDATE.payload', action.payload);
      break;
    case actions.MESSAGE_SUBSCRIBED:
      state.get('history').enq({
        type: messageType.system,
        body: 'Established connection with server',
      });
      return state
        .set('refresh', !state.get('refresh'));

    case actions.FETCH_CHAT_HISTORY_RESULT:
      _.each(action.data, (message) => {
        state.get("history").enq(convertMessageToJSON(message));
      });

      return state
        .set('refresh', !state.get('refresh'));  
    default:
      return state;
  }
  return state;
}
