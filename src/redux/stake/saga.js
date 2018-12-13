import { call, all, takeEvery, put } from 'redux-saga/effects';

import actions from './actions';
import appActions from '../app/actions';
import ScatterHelper from '../../helpers/scatter';

const {
  handleScatterError, getMyStakeAndDividend, getContractSnapshot, getContractStakeAndDividend, stake, unstake, getBETXCirculation, claimDividend,
} = ScatterHelper;


function* stakeRequest(action) {
  try {
    const response = yield call(stake, action.payload);

    yield put({
      type: appActions.SET_SUCCESS_MESSAGE,
      message: {
        id: {
          id: 'message.success.stake',
        },
        values: {
          asset: action.payload.quantity,
        },
      },
    });

    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

function* unstakeRequest(action) {
  try {
    const response = yield call(unstake, action.payload);

    yield put({
      type: appActions.SET_SUCCESS_MESSAGE,
      message: {
        id: {
          id: 'message.success.unstake',
        },
        values: {
          asset: action.payload.quantity,
        },
      },
    });

    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

function* getMyStakeAndDividendRequest(action) {
  try {
    const response = yield call(getMyStakeAndDividend, action.username);

    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}

function* getContractSnapshotRequest() {
  try {
    const response = yield call(getContractSnapshot);

    yield put({
      type: actions.GET_CONTRACT_SNAPSHOT_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}

function* getContractDividendRequest() {
  try {
    const response = yield call(getContractStakeAndDividend);

    yield put({
      type: actions.GET_CONTRACT_DIVIDEND_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}


function* getBETXCirculationRequest() {
  try {
    const response = yield call(getBETXCirculation);

    yield put({
      type: actions.GET_BETX_CIRCULATION_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}

function* claimDividendRequest(action) {
  try {
    const response = yield call(claimDividend, action.payload);

    yield put({
      type: appActions.SET_SUCCESS_MESSAGE,
      message: {
        id: {
          id: 'message.success.claimdividend',
        },
        values: {
          asset: action.payload.quantity,
        },
      },
    });

    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID,
      username: action.payload.user,
    });

    // Retrieve EOS balance if success
    yield put({
      type: appActions.GET_ACCOUNT,
      name: action.payload && action.payload.username,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: appActions.SET_ERROR_MESSAGE,
      message,
    });
  }
}


export default function* () {
  yield all([
    takeEvery(actions.STAKE, stakeRequest),
    takeEvery(actions.UNSTAKE, unstakeRequest),
    takeEvery(actions.GET_MY_STAKE_AND_DIVID, getMyStakeAndDividendRequest),
    takeEvery(actions.GET_CONTRACT_SNAPSHOT, getContractSnapshotRequest),
    takeEvery(actions.GET_CONTRACT_DIVIDEND, getContractDividendRequest),
    takeEvery(actions.GET_BETX_CIRCULATION, getBETXCirculationRequest),
    takeEvery(actions.CLAIM_DIVIDEND, claimDividendRequest),
  ]);
}
