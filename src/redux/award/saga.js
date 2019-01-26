
/* eslint no-console: 0 */

import { all, take, takeEvery, put, call } from 'redux-saga/effects';
import actions from './actions';
import ScatterHelper from '../../helpers/scatter';
import { delay } from '../../helpers/utility';

const {
  getRedeemTable, handleScatterError,
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
    console.log(message);
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.FETCH_REDEEM_TABLE, fetchRedeemTableRequest),
  ]);
}

