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
  SET_PENDING_BET: 'SET_PENDING_BET',
  RESET_PENDING_BET: 'RESET_PENDING_BET',
  START_POLL_BET_RANK: 'START_POLL_BET_RANK',
  BET_RANK_RESULT: 'BET_RANK_RESULT',
  SET_CURRENCY: 'SET_CURRENCY',
  GET_BET_RANK_LIST: 'GET_BET_RANK_LIST',
  initSocketConnection: (obj) => ({
    type: actions.INIT_SOCKET_CONNECTION_BET,
    payload: obj,
  }),
  closeSocketConnection: () => ({
    type: actions.CLOSE_SOCKET_CONNECTION_BET,
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
  startPollBetRank: (params) => ({
    type: actions.START_POLL_BET_RANK,
    payload: params,
  }),
  getBetRankList: (params) => ({
    type: actions.GET_BET_RANK_LIST,
    payload: params,
  }),
  setCurrency: (value) => ({
    type: actions.SET_CURRENCY,
    value,
  }),
  resetPendingBet: () => ({
    type: actions.RESET_PENDING_BET,
  }),
};

export default actions;
