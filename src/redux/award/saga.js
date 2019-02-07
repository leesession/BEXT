
/* eslint no-console: 0 */

import { all, take, takeEvery, put, call } from 'redux-saga/effects';
import actions from './actions';
import ScatterHelper from '../../helpers/scatter';
import { delay } from '../../helpers/utility';
import appActions from '../app/actions';

const {
  getRedeemTable, claimBuyback, handleScatterError,
} = ScatterHelper;

export function* fetchRedeemTableRequest() {
  try {
    const response = yield call(getRedeemTable);
    yield put({
      type: actions.FETCH_REDEEM_TABLE_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export function* claimBuybackRequest(action) {
  try {
    const response = yield call(claimBuyback, action.payload);
    yield put({
      type: actions.CLAIM_BUYBACK_RESULT,
      value: response,
    });

    yield put({
      type: appActions.SET_SUCCESS_MESSAGE,
      messsage: { id: { id: 'message.success.buyback' } },
    });

    // Wait for 2 sec and re-fetch redeem table
    yield call(delay, 2000);

    yield put({
      type: actions.FETCH_REDEEM_TABLE,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.FETCH_REDEEM_TABLE, fetchRedeemTableRequest),
    takeEvery(actions.CLAIM_BUYBACK, claimBuybackRequest),
  ]);
}

