import { call, all, takeEvery, put } from 'redux-saga/effects';

import actions from './actions';
import ScatterHelper from '../../helpers/scatter';

const {
  handleScatterError,  getMySnapshotTotal, getContractSnapshotTotal, 
} = ScatterHelper;


function* getMySnapshotTotalRequest() {
  try {
    const response = yield call(getMySnapshotTotal);

    yield put({
      type: actions.GET_MY_SNAPSHOT_TOTAL_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}

function* getContractSnapshotTotalRequest() {
  try {
    const response = yield call(getContractSnapshotTotal);

    yield put({
      type: actions.GET_CONTRACT_SNAPSHOT_TOTAL_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}

function* logoutRequest() {
  try {
    const response = yield call(logout);
    console.log(response);

    if (response) {
      yield put({
        type: actions.CLEAR_USER_INFO,
      });
    }
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

export default function* () {
  yield all([
    takeEvery(actions.GET_MY_SNAPSHOT_TOTAL, getMySnapshotTotalRequest),
    takeEvery(actions.GET_CONTRACT_SNAPSHOT_TOTAL, getContractSnapshotTotalRequest),
  ]);
}
