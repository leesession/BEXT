/* eslint no-console: 0 */

import { all, take, takeEvery, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import appActions from '../app/actions';
import ParseHelper from '../../helpers/parse';
import { delay } from '../../helpers/utility';
import { appConfig } from '../../settings';

const {
  subscribe, unsubscribe, fetchBetHistory, handleParseError, getBetRank,
} = ParseHelper;

let betRankPollStarted = false;
let betrankPollParams;
let betChannel;

function websocketInitChannel(payload) {
  return eventChannel((emitter) => {
    const subscription = subscribe(payload.collection);

    const subscribeHandler = () => {
      console.log('Bet live channel subscribed.');
      return emitter({ type: actions.BET_SUBSCRIBED });
    };

    const updateHandler = (object) =>
      emitter({ type: actions.BET_OBJECT_UPDATED, data: object });
    const createHandler = (object) =>
      emitter({ type: actions.BET_OBJECT_CREATED, data: object });
    const unsubscribeHandler = () => emitter({ type: actions.BET_UNSUBSCRIBED, payload });

    const errorHandler = (object) => {
      // create an Error object and put it into the channel
      emitter({
        type: actions.BET_CHANNEL_ERROR,
        error: new Error(object),
      });
    };

    subscription.on('open', subscribeHandler);
    subscription.on('close', unsubscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('create', createHandler);
    subscription.on('error', errorHandler);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribeChannel = () => {
      // Close the connection
      unsubscribe(subscription);
      console.log('Bet channel unsubscribed.');
    };

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeChannel;
  });
}

export function* initLiveBetHistory(action) {
  try {
    betChannel = yield call(websocketInitChannel, action.payload);

    while (true) {
      const payload = yield take(betChannel);

      yield put(payload);
    }
  } catch (err) {
    console.error('socket error:', err);
    // socketChannel is still open in catch block
    // if we want end the socketChannel, we need close it explicitly
  }
}

export function* closeSocketRequest() {
  if (betChannel) {
    betChannel.close();
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
    console.log(err);
    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export function* fetchMyBetHistoryRequest(action) {
  try {
    const params = action.payload;
    params.type = actions.BET_HISTORY_TYPE.MY;
    const response = yield call(fetchBetHistory, params);

    yield put({
      type: actions.FETCH_MY_BET_HISTORY_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);
    console.log(err);
    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export function* fetchHugeBetHistoryRequest(action) {
  try {
    const params = action.payload;
    params.type = actions.BET_HISTORY_TYPE.HUGE;
    const response = yield call(fetchBetHistory, params);

    yield put({
      type: actions.FETCH_HUGE_BET_HISTORY_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);
    console.log(err);
    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export function* startPollBetRankRequest(action) {
  betrankPollParams = action.payload;

  if (betRankPollStarted) {
    return;
  }

  betRankPollStarted = true;
  while (true) {
    try {
      const response = yield call(getBetRank, betrankPollParams);

      yield put({
        type: actions.BET_RANK_RESULT,
        value: response,
      });

      yield call(delay, appConfig.pollBetRankInterval);
    } catch (err) {
      const message = yield call(handleParseError, err);
      console.log(err);
    }
  }
}

export function* getBetRankList() {
  try {
    const response = yield call(getBetRank);
    yield put({
      type: actions.BET_RANK_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleParseError, err);
    console.log(err);
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_CONNECTION_BET, initLiveBetHistory),
    takeEvery(actions.CLOSE_SOCKET_CONNECTION_BET, closeSocketRequest),
    takeEvery(actions.FETCH_BET_HISTORY, fetchBetHistoryRequest),
    takeEvery(actions.FETCH_MY_BET_HISTORY, fetchMyBetHistoryRequest),
    takeEvery(actions.FETCH_HUGE_BET_HISTORY, fetchHugeBetHistoryRequest),
    takeEvery(actions.START_POLL_BET_RANK, startPollBetRankRequest),
    takeEvery(actions.GET_BET_RANK_LIST, getBetRankList),
  ]);
}

