const actions = {
  INIT_SOCKET_CONNECTION_BET: 'INIT_SOCKET_CONNECTION_BET',
  CLOSE_SOCKET_CONNECTION_BET: 'CLOSE_SOCKET_CONNECTION_BET',
  FETCH_BET_HISTORY: 'FETCH_BET_HISTORY',
  FETCH_MY_BET_HISTORY: 'FETCH_MY_BET_HISTORY',
  FETCH_HUGE_BET_HISTORY: 'FETCH_HUGE_BET_HISTORY',
  BET_HISTORY_TYPE: {
    MY: 'MY',
    HUGE: 'HUGE`',
  },
  FETCH_BET_HISTORY_RESULT: 'FETCH_BET_HISTORY_RESULT',
  FETCH_MY_BET_HISTORY_RESULT: 'FETCH_MY_BET_HISTORY_RESULT',
  FETCH_HUGE_BET_HISTORY_RESULT: 'FETCH_HUGE_BET_HISTORY_RESULT',
  BET_SUBSCRIBED: 'BET_SUBSCRIBED',
  BET_UNSUBSCRIBED: 'BET_UNSUBSCRIBED',
  BET_CHANNEL_UPDATE: 'BET_CHANNEL_UPDATE',
  BET_CHANNEL_ERROR: 'BET_CHANNEL_ERROR',
  BET_OBJECT_CREATED: 'BET_OBJECT_CREATED',
  BET_OBJECT_UPDATED: 'BET_OBJECT_UPDATED',
  BET_OBJECT_DELETED: 'BET_OBJECT_DELETED',
  BET_OBJECT_ENTERED: 'BET_OBJECT_ENTERED',
  BET_OBJECT_LEFT: 'BET_OBJECT_LEFT',
  GET_BET_VOLUME: 'GET_BET_VOLUME',
  GET_BET_VOLUME_RESULT: 'GET_BET_VOLUME_RESULT',
  GET_BETX_STAKE_AMOUNT: 'GET_BETX_STAKE_AMOUNT',
  GET_BETX_STAKE_AMOUNT_RESULT: 'GET_BETX_STAKE_AMOUNT_RESULT',
  ADD_CURRENT_BET: 'ADD_CURRENT_BET',
  DELETE_CURRENT_BET: 'DELETE_CURRENT_BET',
  START_POLL_BET_RANK: 'START_POLL_BET_RANK',
  BET_RANK_RESULT: 'BET_RANK_RESULT',
  SET_CURRENCY: 'SET_CURRENCY',
  initSocketConnection: (obj) => ({
    type: actions.INIT_SOCKET_CONNECTION_BET,
    payload: obj,
  }),
  fetchBetHistory: () => ({
    type: actions.FETCH_BET_HISTORY,
  }),
  fetchMyBetHistory: (params) => ({
    type: actions.FETCH_MY_BET_HISTORY,
    payload: params,
  }),
  fetchHugeBetHistory: (params) => ({
    type: actions.FETCH_HUGE_BET_HISTORY,
    payload: params,
  }),
  getBetVolume: () => ({
    type: actions.GET_BET_VOLUME,
  }),
  getBETXStakeAmount: () => ({
    type: actions.GET_BETX_STAKE_AMOUNT,
  }),
  deleteCurrentBet: (transactionId) => ({
    type: actions.DELETE_CURRENT_BET,
    value: transactionId,
  }),
  startPollBetRank: (params) => ({
    type: actions.START_POLL_BET_RANK,
    payload: params,
  }),
  getBetRankList: (params)=> ({
    type: actions.BET_RANK_RESULT,
    payload: params,
  }),
  setCurrency: (value) => ({
    type: actions.SET_CURRENCY,
    value,
  }),
};

export default actions;
