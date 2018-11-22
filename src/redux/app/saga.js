import {
  call, all, takeEvery, put, fork, cancel, take, cancelled,
} from 'redux-saga/effects';

import _ from 'lodash';
import actions from './actions';
import ScatterHelper from '../../helpers/scatter';
const {
  handleScatterError, getIdentity, transfer, getBalance, getEOSBalance, getBETXBalance,
} = ScatterHelper;

function* getIdentityRequest(action) {
  const params = action.payload;

  try {
    const response = yield call(getIdentity);

    yield put({ type: actions.GET_USERNAME_RESULT, value: response.name });

    const eosBalance = yield call(getEOSBalance, response.name);

    yield put({
      type: actions.GET_EOS_BALANCE_RESULT,
      value: eosBalance,
    });

    const betxBalance = yield call(getBETXBalance, response.name);

    yield put({
      type: actions.GET_BETX_BALANCE_RESULT,
      value: betxBalance,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

function* transferRequest(action) {
  const params = action.payload;

  try {
    const response = yield call(transfer, params);
    yield put({
      type: actions.SUCCESS_MESSAGE,
      message: 'message.success.bet',
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

function* setErrorMessageRequest(action) {
  const { message } = action;

  // 1. First set error message
  yield put({
    type: actions.ERROR_MESSAGE,
    message,
  });
  // 2. Clear error message immediately
  yield put({
    type: actions.CLEAR_ERROR_MESSAGE,
  });
}

export default function* () {
  yield all([
    takeEvery(actions.GET_IDENTITY, getIdentityRequest),
    takeEvery(actions.TRANSFER_REQUEST, transferRequest),
    takeEvery(actions.SET_ERROR_MESSAGE, setErrorMessageRequest),
  ]);
}
