import _ from 'lodash';
import { all, take, takeEvery, put, fork, call, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import ParseHelper from '../../helpers/parse';
const {
  subscribe, unsubscribe, sendBet, fetchBetHistory, handleParseError, getBetVolume, getBetxStakeAmount
} = ParseHelper;


function websocketInitChannel(payload) {
  return eventChannel((emitter) => {
    const subscription = subscribe(payload.collection);

    const subscribeHandler = () => emitter({ type: actions.BET_SUBSCRIBED });

    const updateHandler = (object) => {
      // console.log('object updated', object);
      return emitter({ type: actions.BET_OBJECT_UPDATED, data: object });
    };

    const createHandler = (object) => {
      // console.log('object created', object);
      return emitter({ type: actions.BET_OBJECT_CREATED, data: object });
    };

    const deleteHandler = (object) => {
      // console.log('object deleted', object);
      return emitter({ type: actions.BET_OBJECT_DELETED, data: object });
    };

    const enterHandler = (object) => {
      // console.log('object entered', object);
      return emitter({ type: actions.BET_OBJECT_ENTERED, data: object });
    };

    const leaveHandler = (object) => {
      // console.log('object left', object);
      return emitter({ type: actions.BET_OBJECT_LEFT, data: object });
    };

    const unsubscribeHandler = () => {
      // console.log('subscription close');
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
    const channel = yield call(websocketInitChannel, action.payload);

    while (true) {
      const payload = yield take(channel);

      if(_.isUndefined(payload)){
        console.log("initLiveBetHistory, payload is undefined.");
      }

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

export function * getBetVolumeRequest(){
  try{
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

    console.log(message);
  }
}

export function * getBetxStakeAmountRequest(){
  try{
  const result = yield call(getBetxStakeAmount);
    yield put({
      type: actions.GET_BETX_STAKE_AMOUNT_RESULT,
      value: result,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);
    console.log(message);
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
  ]);
}
