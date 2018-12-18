/* eslint no-restricted-syntax:0 */
import { call, all, takeEvery, put } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import betActions from '../bet/actions';
import ScatterHelper from '../../helpers/scatter';

const {
  handleScatterError, getIdentity, transfer, getAccount, logout, getCurrencyBalance,
} = ScatterHelper;

const symbols = [
  {
    symbol: 'EOS', precision: 4, contract: 'eosio.token', putType: actions.GET_EOS_BALANCE_RESULT,
  },
  {
    symbol: 'BETX', precision: 4, contract: 'thebetxtoken', putType: actions.GET_BETX_BALANCE_RESULT,
  },
  {
    symbol: 'EBTC', precision: 8, contract: 'bitpietokens', putType: actions.GET_EBTC_BALANCE_RESULT,
  },
  {
    symbol: 'EETH', precision: 8, contract: 'bitpietokens', putType: actions.GET_EETH_BALANCE_RESULT,
  },
  {
    symbol: 'EUSD', precision: 8, contract: 'bitpietokens', putType: actions.GET_EUSD_BALANCE_RESULT,
  },
];

function* getIdentityRequest() {
  try {
    const response = yield call(getIdentity);

    yield put({ type: actions.GET_USERNAME_RESULT, value: response.name });

    yield put({
      type: actions.SET_SUCCESS_MESSAGE,
      messsage: { id: { id: 'topbar.message.welcome' }, values: { name: response.name } },
    });

    yield put({ type: actions.GET_ACCOUNT, name: response.name });

    yield put({ type: actions.GET_BALANCES, name: response.name });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

function* getBalancesRequest(action) {
  const { name } = action;

  try {
    for (const entry of Array.from(symbols)) {
      const balance = yield call(getCurrencyBalance, {
        name, contract: entry.contract, symbol: entry.symbol,
      });
      yield put({
        type: entry.putType,
        value: balance,
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

function* getAccountRequest(action) {
  const { name } = action;

  try {
    const response = yield call(getAccount, name);

    yield put({
      type: actions.GET_CPU_USAGE_RESULT,
      value: response.cpuUsage,
    });

    yield put({
      type: actions.GET_NET_USAGE_RESULT,
      value: response.netUsage,
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    // Silence error message
    console.log(err);
  }
}

function* transferRequest(action) {
  const params = action.payload;

  const matchSymbol = _.find(symbols, { symbol: params.betAsset });

  if (_.isUndefined(matchSymbol)) {
    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message: 'message.error.unknownSymbol',
    });

    return;
  }

  params.contract = matchSymbol.contract;
  params.precision = matchSymbol.precision;

  try {
    const response = yield call(transfer, params);

    yield put({
      type: betActions.ADD_CURRENT_BET,
      value: {
        betAmount: response.processed.action_traces[0].act.data.quantity,
        transactionId: response.transaction_id,
      },
    });
  } catch (err) {
    const message = yield call(handleScatterError, err);

    yield put({
      type: actions.SET_ERROR_MESSAGE,
      message,
    });
  }
}

function* setSuccessMessageRequest(action) {
  const { message } = action;

  // 1. First set error message
  yield put({
    type: actions.SUCCESS_MESSAGE,
    message,
  });
}

function* setErrorMessageRequest(action) {
  const { message } = action;

  // 1. First set error message
  yield put({
    type: actions.ERROR_MESSAGE,
    message,
  });
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
    takeEvery(actions.GET_IDENTITY, getIdentityRequest),
    takeEvery(actions.GET_ACCOUNT, getAccountRequest),
    takeEvery(actions.GET_BALANCES, getBalancesRequest),
    takeEvery(actions.TRANSFER_REQUEST, transferRequest),
    takeEvery(actions.SET_ERROR_MESSAGE, setErrorMessageRequest),
    takeEvery(actions.SET_SUCCESS_MESSAGE, setSuccessMessageRequest),
    takeEvery(actions.LOG_OUT, logoutRequest),
  ]);
}
