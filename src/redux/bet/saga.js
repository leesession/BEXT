import _ from 'lodash';
import { all, take, takeEvery, put, fork, call, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import ParseHelper from '../../helpers/parse';
import { delay } from '../../helpers/utility';
import { appConfig } from '../../settings';

const {
  subscribe, unsubscribe, sendBet, fetchBetHistory, handleParseError, getBetVolume, getBetxStakeAmount,
} = ParseHelper;

let betGlobalChannel;

function websocketInitChannel(payload) {
  return eventChannel((emitter) => {
    const subscription = subscribe(payload.collection);

    const subscribeHandler = () => {
      console.log('Bet live channel subscribed.');
      return emitter({ type: actions.BET_SUBSCRIBED });
    };

    const updateHandler = (object) =>
      // console.log('object updated', object);
      emitter({ type: actions.BET_OBJECT_UPDATED, data: object });
    const createHandler = (object) =>
      // console.log('object created', object);
      emitter({ type: actions.BET_OBJECT_CREATED, data: object });
    const deleteHandler = (object) =>
      // console.log('object deleted', object);
      emitter({ type: actions.BET_OBJECT_DELETED, data: object });
    const enterHandler = (object) =>
      // console.log('object entered', object);
      emitter({ type: actions.BET_OBJECT_ENTERED, data: object });
    const leaveHandler = (object) =>
      // console.log('object left', object);
      emitter({ type: actions.BET_OBJECT_LEFT, data: object });
    const unsubscribeHandler = () => {
      // console.log('subscription close');
      betGlobalChannel = undefined;
      return emitter({ type: actions.BET_UNSUBSCRIBED });
    };

    const errorHandler = (errorEvent) => {
      // create an Error object and put it into the channel
      emitter({
        type: actions.BET_CHANNEL_ERROR,
        error: new Error(errorEvent.reason),
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
      // Close the connection
      unsubscribe(subscription);
      return emitter({ type: actions.BET_UNSUBSCRIBED });
    };

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeChannel;
  });
}

export function* initLiveBetHistory(action) {
  try {
    if (!_.isUndefined(betGlobalChannel)) {
      return;
    }

    betGlobalChannel = yield call(websocketInitChannel, action.payload);

    while (true) {
      const payload = yield take(betGlobalChannel);

      yield put(payload);
    }
  } catch (err) {
    console.error('socket error:', err);
    // socketChannel is still open in catch block
    // if we want end the socketChannel, we need close it explicitly
    // socketChannel.close()
  }
}

export function* reconnectLiveBetRequest() {
  try {
    console.log(`Bet live channel unsubscribed; waiting for ${appConfig.betChannelReconnectInterval} ms before reconnect.`);

    yield call(delay, appConfig.betChannelReconnectInterval);

    // Reconnect to make sure there's always a ws connection
    yield put({
      type: actions.INIT_SOCKET_CONNECTION_BET,
    });
  } catch (err) {
    console.error(err);
  }
}

export function* fetchBetHistoryRequest() {
  try {
    const response = yield call(fetchBetHistory);

    yield put({
      type: actions.FETCH_BET_HISTORY_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);

    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export function* getBetVolumeRequest() {
  try {
    const result = yield call(getBetVolume);
    yield put({
      type: actions.GET_BET_VOLUME_RESULT,
      value: result,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);

    // yield put({
    //   type: actions.SET_ERROR_MESSAGE,
    //   message,
    // });

    // console.log(message);
  }
}

export function* getBetxStakeAmountRequest() {
  try {
    const result = yield call(getBetxStakeAmount);
    yield put({
      type: actions.GET_BETX_STAKE_AMOUNT_RESULT,
      value: result,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);
    // console.log(message);
    // yield put({
    //   type: actions.SET_ERROR_MESSAGE,
    //   message,
    // });
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_CONNECTION_BET, initLiveBetHistory),
    takeEvery(actions.FETCH_BET_HISTORY, fetchBetHistoryRequest),
    takeEvery(actions.GET_BET_VOLUME, getBetVolumeRequest),
    takeEvery(actions.GET_BETX_STAKE_AMOUNT, getBetxStakeAmountRequest),
    takeEvery(actions.BET_UNSUBSCRIBED, reconnectLiveBetRequest),
  ]);
}
