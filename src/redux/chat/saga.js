/* eslint no-console: 0 */
import _ from 'lodash';
import { all, take, takeEvery, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import ParseHelper from '../../helpers/parse';

const {
  subscribe, unsubscribe, sendMessage, fetchChatHistory, handleParseError,
} = ParseHelper;

let chatChannel;

function websocketInitChannel(payload) {
  return eventChannel((emitter) => {
    const subscription = subscribe(payload.collection);

    const subscribeHandler = () => {
      console.log('Chat live channel subscribed.');
      return emitter({ type: actions.MESSAGE_SUBSCRIBED });
    };

    const updateHandler = (object) =>
      emitter({ type: actions.MESSAGE_OBJECT_UPDATED, data: object });
    const createHandler = (object) =>
      emitter({ type: actions.MESSAGE_OBJECT_CREATED, data: object });
    const deleteHandler = (object) =>
      emitter({ type: actions.MESSAGE_OBJECT_DELETED, data: object });
    const unsubscribeHandler = () => emitter({ type: actions.MESSAGE_UNSUBSCRIBED, payload });

    const errorHandler = (object) => {
      // console.log('errorHandler.event', errorEvent);
      // create an Error object and put it into the channel
      emitter({
        type: actions.MESSAGE_CHANNEL_ERROR,
        error: new Error(object),
      });
    };

    subscription.on('open', subscribeHandler);
    subscription.on('close', unsubscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('create', createHandler);
    subscription.on('delete', deleteHandler);
    subscription.on('error', errorHandler);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribeChannel = () => {
      // Close the connection
      unsubscribe(subscription);
      console.log('Chat channel unsubscribed.');
    };

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeChannel;
  });
}

export function* initLiveMessages(action) {
  try {
    chatChannel = yield call(websocketInitChannel, action.payload);

    while (true) {
      const payload = yield take(chatChannel);

      yield put(payload);
    }
  } catch (err) {
    console.error('socket error:', err);
  }
}

export function closeSocketRequest() {
  if (chatChannel) {
    chatChannel.close();
  }
}

export function* sendMessageRequest(action) {
  try {
    const res = yield call(sendMessage, action.payload);
  } catch (e) {
    const message = handleParseError(e);

    console.error(message);
  }
}

export function* fetchChatHistoryRequest() {
  try {
    const response = yield call(fetchChatHistory);

    yield put({
      type: actions.FETCH_CHAT_HISTORY_RESULT,
      data: response,
    });
  } catch (e) {
    const message = handleParseError(e);

    console.error(message);
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_CONNECTION_MESSAGE, initLiveMessages),
    takeEvery(actions.CLOSE_SOCKET_CONNECTION_MESSAGE, closeSocketRequest),
    takeEvery(actions.SEND_MESSAGE, sendMessageRequest),
    takeEvery(actions.FETCH_CHAT_HISTORY, fetchChatHistoryRequest),
  ]);
}
