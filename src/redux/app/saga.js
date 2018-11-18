import {
  call, all, takeEvery, put, fork, cancel, take, cancelled,
} from 'redux-saga/effects';

import _ from 'lodash';
import actions from './actions';
import ScatterHelper from '../../helpers/scatter';
const {
  handleScatterError, getIdentity, transfer, getBalance, getEOSBalance, getBETXBalance
} = ScatterHelper;

function* getIdentityRequest(action) {
  const params = action.payload;

  try {
    const response = yield call(getIdentity);

    console.log('saga.getIdentityRequest.response', response);
    yield put({ type: actions.GET_USERNAME_RESULT, value: response.name });

    const eosBalance = yield call(getEOSBalance, response.name);
    console.log('getIdentityRequest.eosBalance', eosBalance);

    yield put({ 
      type: actions.GET_EOS_BALANCE_RESULT, 
      value: eosBalance,
    });

    const betxBalance = yield call(getBETXBalance, response.name);
    console.log('getIdentityRequest.betxBalance', betxBalance);

    yield put({ 
      type: actions.GET_BETX_BALANCE_RESULT, 
      value: betxBalance,
    });
  } catch (err) {
    yield call(handleScatterError, err);
    yield put({
      type: actions.GET_USERNAME_RESULT,
      error: err,
    });
  }
}

function* transferRequest(action) {
  const params = action.payload;

  try {
    const response = yield call(transfer, params);
    yield put({ type: actions.TRANSFER_RESULT, value: response });
  } catch (err) {
    yield call(handleScatterError, err);
    yield put({
      type: actions.TRANSFER_RESULT,
      error: err,
    });
  }
}

export default function* () {
  yield all([
    takeEvery(actions.GET_IDENTITY, getIdentityRequest),
    takeEvery(actions.TRANSFER_REQUEST, transferRequest),
  ]);
}
