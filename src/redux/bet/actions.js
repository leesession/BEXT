const actions = {
  INIT_SOCKET_CONNECTION_BET: 'INIT_SOCKET_CONNECTION_BET',
  CLOSE_SOCKET_CONNECTION_BET: 'CLOSE_SOCKET_CONNECTION_BET',
  FETCH_BET_HISTORY: 'FETCH_BET_HISTORY',
  FETCH_BET_HISTORY_RESULT: 'FETCH_BET_HISTORY_RESULT',
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
  initSocketConnection: (obj) => ({
    type: actions.INIT_SOCKET_CONNECTION_BET,
    payload: obj,
  }),
  fetchBetHistory: () => ({
    type: actions.FETCH_BET_HISTORY,
  }),
  getBetVolume: () => ({
    type: actions.GET_BET_VOLUME,
  }),
  getBETXStakeAmount: () => ({
    type: actions.GET_BETX_STAKE_AMOUNT,
  }),
};

export default actions;
