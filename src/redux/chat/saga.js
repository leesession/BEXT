import _ from 'lodash';
import { all, take, takeEvery, put, fork, call, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import ParseHelper from '../../helpers/parse';
const { subscribe, unsubscribe, sendMessage } = ParseHelper;

function websocketInitChannel(payload) {
  return eventChannel((emitter) => {
    const subscription = subscribe(payload.collection);

    const subscribeHandler = () => emitter({ type: actions.MESSAGE_SUBSCRIBED });

    const updateHandler = (object) => {
      console.log('object updated', object);
      return emitter({ type: actions.MESSAGE_OBJECT_UPDATED, data: object });
    };

    const createHandler = (object) => {
      console.log('object created', object);
      return emitter({ type: actions.MESSAGE_OBJECT_CREATED, data: object });
    };

    const deleteHandler = (object) => {
      console.log('object deleted', object);
      return emitter({ type: actions.MESSAGE_OBJECT_DELETED, data: object });
    };

    const enterHandler = (object) => {
      console.log('object entered', object);
      return emitter({ type: actions.MESSAGE_OBJECT_ENTERED, data: object });
    };

    const leaveHandler = (object) => {
      console.log('object left', object);
      return emitter({ type: actions.MESSAGE_OBJECT_LEFT, data: object });
    };

    const unsubscribeHandler = () => {
      console.log('subscription close');
      return emitter({ type: actions.MESSAGE_UNSUBSCRIBED });
    };

    const errorHandler = (errorEvent) => {
      console.log('errorHandler.event', errorEvent);
      // create an Error object and put it into the channel
      emitter({type: MESSAGE_CHANNEL_ERROR,
        error:new Error(errorEvent.reason)
      });
    };

    subscription.on('open', subscribeHandler);
    subscription.on('close', unsubscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('create', createHandler);
    subscription.on('delete', deleteHandler);
    subscription.on('enter', enterHandler);
    subscription.on('leave', leaveHandler);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribeChannel = () => {
      console.log('eventChannel return gets called');
      // Close the connection
      unsubscribe(subscription);
      return emitter({ type: actions.MESSAGE_UNSUBSCRIBED });
    };

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeChannel;
  });
}

export function* initLiveMessages(action) {
  const channel = yield call(websocketInitChannel, action.payload);

  try {
    while (true) {
      const payload = yield take(channel);

      console.log('chat.sata.initLiveMessages.take(channel)', payload);
      yield put(payload);
    }
  } catch (err) {
    console.error('socket error:', err);
    // socketChannel is still open in catch block
    // if we want end the socketChannel, we need close it explicitly
    // socketChannel.close()
  } finally {
    console.log('message stream terminated');
  }
}

export function* sendMessageRequest(action) {
  const res = yield call(sendMessage, action.payload);
  console.log(res);
  // yield put({
  //   type:'',
  //   value: res,
  // });
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_CONNECTION_MESSAGE, initLiveMessages),
    takeEvery(actions.SEND_MESSAGE, sendMessageRequest),
  ]);
}
