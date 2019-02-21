import _ from 'lodash';
import { Map } from 'immutable';

import actions from './actions';

import { enqueue } from '../../helpers/utility';
import { appConfig } from '../../settings';

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
  history: [],
  refresh: false,
});

export default function (state = initState, action) {
  switch (action.type) {
    case actions.INIT_SOCKET_CONNECTION_MESSAGE:

      return state
        .set('refresh', !state.get('refresh'));
    case actions.MESSAGE_OBJECT_CREATED:
      enqueue(state.get('history'), convertMessageToJSON(action.data), appConfig.chatHistoryMemorySize);
      return state.set('refresh', !state.get('refresh'));
    case actions.MESSAGE_SUBSCRIBED:
      enqueue(state.get('history'), {
        type: messageType.system,
        body: 'Established connection with server',
      }, appConfig.chatHistoryMemorySize);

      return state.set('refresh', !state.get('refresh'));
    case actions.FETCH_CHAT_HISTORY_RESULT:
      return state.set('history', _.map(action.data, (message) => convertMessageToJSON(message)))
        .set('refresh', !state.get('refresh'));
    case actions.MESSAGE_CLEAR:
      return state.set('history', initState.history)
        .set('refresh', !state.get('refresh'));
    default:
      return state;
  }
}
