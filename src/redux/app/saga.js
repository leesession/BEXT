import { call, all, takeEvery, put, fork, cancel, take, cancelled } from 'redux-saga/effects';

import _ from 'lodash';
import actions from './actions';
import betActions from '../bet/actions';
import ScatterHelper from '../../helpers/scatter';

const {
  handleScatterError, getIdentity, transfer, getEOSBalance, getBETXBalance, getAccount
} = ScatterHelper;

function* getIdentityRequest() {
  try {
    const response = yield call(getIdentity);

    yield put({ type: actions.GET_USERNAME_RESULT, value: response.name });

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
    // const eosBalance = yield call(getEOSBalance, name);

    // yield put({
    //   type: actions.GET_EOS_BALANCE_RESULT,
    //   value: eosBalance,
    // });

    const betxBalance = yield call(getBETXBalance, name);

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

function* getAccountRequest(action) {
  const { name } = action;

  try {
    const response = yield call(getAccount, name);

    console.log("getAccountRequest.response: ", response);
    yield put({
      type: actions.GET_EOS_BALANCE_RESULT,
      value: response.eosBalance,
    });

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

  try {
    const response = yield call(transfer, params);

    yield put({
      type: betActions.ADD_CURRENT_BET,
      value: {
        betAmount: response.processed.action_traces[0].act.data.quantity,
        transactionId: response.transaction_id,
      },
    });

    // {
    //   "broadcast": true,
    //   "transaction": {
    //     "compression": "none",
    //     "transaction": {
    //       "expiration": "2018-11-26T05:45:10",
    //       "ref_block_num": 6748,
    //       "ref_block_prefix": 3588480797,
    //       "max_net_usage_words": 0,
    //       "max_cpu_usage_ms": 0,
    //       "delay_sec": 0,
    //       "context_free_actions": [],
    //       "actions": [
    //         {
    //           "account": "eosio.token",
    //           "name": "transfer",
    //           "authorization": [
    //             {
    //               "actor": "bilibilibooo",
    //               "permission": "active"
    //             }
    //           ],
    //           "data": "40293d2ebae3a23b70d5e4b4677554cbe80300000000000004454f53000000000435302d2d"
    //         }
    //       ],
    //       "transaction_extensions": []
    //     },
    //     "signatures": [
    //       "SIG_K1_KYS5seSqphnwU5DNSNCEe3nFkuCYZh3J2Z5hsEYaEgo4kndDGXQVxmTG5BXZ1HDFsaWpT56drQHfiqwJeJjUE8RXKLc1Sh"
    //     ]
    //   },
    //   "transaction_id": "8b25b9ec09d3431b99ad12ae7df7334d8a926321df684c0a1938f16ec79a81fc",
    //   "processed": {
    //     "id": "8b25b9ec09d3431b99ad12ae7df7334d8a926321df684c0a1938f16ec79a81fc",
    //     "block_num": 28908468,
    //     "block_time": "2018-11-26T05:44:16.000",
    //     "producer_block_id": null,
    //     "receipt": {
    //       "status": "executed",
    //       "cpu_usage_us": 802,
    //       "net_usage_words": 17
    //     },
    //     "elapsed": 802,
    //     "net_usage": 136,
    //     "scheduled": false,
    //     "action_traces": [
    //       {
    //         "receipt": {
    //           "receiver": "eosio.token",
    //           "act_digest": "651ca4fe9392023f5c62dbe182f162e350fb36af4fc84e94fe0779fa5a137671",
    //           "global_sequence": 2097920190,
    //           "recv_sequence": 326060555,
    //           "auth_sequence": [
    //             [
    //               "bilibilibooo",
    //               160
    //             ]
    //           ],
    //           "code_sequence": 2,
    //           "abi_sequence": 2
    //         },
    //         "act": {
    //           "account": "eosio.token",
    //           "name": "transfer",
    //           "authorization": [
    //             {
    //               "actor": "bilibilibooo",
    //               "permission": "active"
    //             }
    //           ],
    //           "data": {
    //             "from": "bilibilibooo",
    //             "to": "thebetxowner",
    //             "quantity": "0.1000 EOS",
    //             "memo": "50--"
    //           },
    //           "hex_data": "40293d2ebae3a23b70d5e4b4677554cbe80300000000000004454f53000000000435302d2d"
    //         },
    //         "context_free": false,
    //         "elapsed": 175,
    //         "console": "",
    //         "trx_id": "8b25b9ec09d3431b99ad12ae7df7334d8a926321df684c0a1938f16ec79a81fc",
    //         "block_num": 28908468,
    //         "block_time": "2018-11-26T05:44:16.000",
    //         "producer_block_id": null,
    //         "account_ram_deltas": [],
    //         "except": null,
    //         "inline_traces": [
    //           {
    //             "receipt": {
    //               "receiver": "bilibilibooo",
    //               "act_digest": "651ca4fe9392023f5c62dbe182f162e350fb36af4fc84e94fe0779fa5a137671",
    //               "global_sequence": 2097920191,
    //               "recv_sequence": 180,
    //               "auth_sequence": [
    //                 [
    //                   "bilibilibooo",
    //                   161
    //                 ]
    //               ],
    //               "code_sequence": 2,
    //               "abi_sequence": 2
    //             },
    //             "act": {
    //               "account": "eosio.token",
    //               "name": "transfer",
    //               "authorization": [
    //                 {
    //                   "actor": "bilibilibooo",
    //                   "permission": "active"
    //                 }
    //               ],
    //               "data": {
    //                 "from": "bilibilibooo",
    //                 "to": "thebetxowner",
    //                 "quantity": "0.1000 EOS",
    //                 "memo": "50--"
    //               },
    //               "hex_data": "40293d2ebae3a23b70d5e4b4677554cbe80300000000000004454f53000000000435302d2d"
    //             },
    //             "context_free": false,
    //             "elapsed": 8,
    //             "console": "",
    //             "trx_id": "8b25b9ec09d3431b99ad12ae7df7334d8a926321df684c0a1938f16ec79a81fc",
    //             "block_num": 28908468,
    //             "block_time": "2018-11-26T05:44:16.000",
    //             "producer_block_id": null,
    //             "account_ram_deltas": [],
    //             "except": null,
    //             "inline_traces": []
    //           },
    //           {
    //             "receipt": {
    //               "receiver": "thebetxowner",
    //               "act_digest": "651ca4fe9392023f5c62dbe182f162e350fb36af4fc84e94fe0779fa5a137671",
    //               "global_sequence": 2097920192,
    //               "recv_sequence": 2301,
    //               "auth_sequence": [
    //                 [
    //                   "bilibilibooo",
    //                   162
    //                 ]
    //               ],
    //               "code_sequence": 2,
    //               "abi_sequence": 2
    //             },
    //             "act": {
    //               "account": "eosio.token",
    //               "name": "transfer",
    //               "authorization": [
    //                 {
    //                   "actor": "bilibilibooo",
    //                   "permission": "active"
    //                 }
    //               ],
    //               "data": {
    //                 "from": "bilibilibooo",
    //                 "to": "thebetxowner",
    //                 "quantity": "0.1000 EOS",
    //                 "memo": "50--"
    //               },
    //               "hex_data": "40293d2ebae3a23b70d5e4b4677554cbe80300000000000004454f53000000000435302d2d"
    //             },
    //             "context_free": false,
    //             "elapsed": 386,
    //             "console": "",
    //             "trx_id": "8b25b9ec09d3431b99ad12ae7df7334d8a926321df684c0a1938f16ec79a81fc",
    //             "block_num": 28908468,
    //             "block_time": "2018-11-26T05:44:16.000",
    //             "producer_block_id": null,
    //             "account_ram_deltas": [
    //               {
    //                 "account": "thebetxowner",
    //                 "delta": 188
    //               }
    //             ],
    //             "except": null,
    //             "inline_traces": []
    //           }
    //         ]
    //       }
    //     ],
    //     "except": null
    //   },
    //   "returnedFields": {}
    // }
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
  // 2. Clear error message immediately
  yield put({
    type: actions.CLEAR_SUCCESS_MESSAGE,
  });
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
    takeEvery(actions.GET_ACCOUNT, getAccountRequest),
    takeEvery(actions.GET_BALANCES, getBalancesRequest),
    takeEvery(actions.TRANSFER_REQUEST, transferRequest),
    takeEvery(actions.SET_ERROR_MESSAGE, setErrorMessageRequest),
    takeEvery(actions.SET_SUCCESS_MESSAGE, setSuccessMessageRequest),
  ]);
}
