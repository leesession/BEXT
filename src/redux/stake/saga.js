import { call, all, takeEvery, put } from 'redux-saga/effects';

import actions from './actions';
import appActions from '../app/actions';
import ScatterHelper from '../../helpers/scatter';
import ParseHelper from '../../helpers/parse';
import { delay } from '../../helpers/utility';

const {
  handleScatterError, getMyStakeAndDividend,
  stake, unstake, claimDividend, withdraw,
} = ScatterHelper;

function* stakeRequest(action) {
  try {
    yield call(stake, action.payload);

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

    // Get new myStake amount
    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID,
    });

    // Get new BETX balance
    yield put({
      type: appActions.GET_BALANCES,
      name: action.payload.username,
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
    yield call(unstake, action.payload);

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

    yield call(delay, 1000);
    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID,
    });

    yield call(delay, 11000);
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

function* withdrawRequest(action) {
  try {
    yield call(withdraw, action.payload);

    yield put({
      type: appActions.SET_SUCCESS_MESSAGE,
      message: {
        id: {
          id: 'message.success.withdraw',
        },
        values: {
          asset: action.payload.quantity,
        },
      },
    });

    yield put({
      type: actions.GET_MY_STAKE_AND_DIVID,
      username: action.payload.username,
    });

    // Retrieve BETX balance if success
    yield put({
      type: appActions.GET_BALANCES,
      name: action.payload.username,
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
    takeEvery(actions.CLAIM_DIVIDEND, claimDividendRequest),
    takeEvery(actions.WITHDRAW, withdrawRequest),
  ]);
}
