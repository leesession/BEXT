const actions = {
  SEND_BET: 'SEND_BET',
  INIT_SOCKET_CONNECTION_BET: 'INIT_SOCKET_CONNECTION_BET',
  CLOSE_SOCKET_CONNECTION_BET: 'CLOSE_SOCKET_CONNECTION_BET',
  BET_SUBSCRIBED: 'BET_SUBSCRIBED',
  BET_UNSUBSCRIBED: 'BET_UNSUBSCRIBED',
  BET_CHANNEL_UPDATE: 'BET_CHANNEL_UPDATE',
  BET_CHANNEL_ERROR: 'BET_CHANNEL_ERROR',
  BET_OBJECT_CREATED: 'BET_OBJECT_CREATED',
  BET_OBJECT_UPDATED: 'BET_OBJECT_UPDATED',
  BET_OBJECT_DELETED: 'BET_OBJECT_DELETED',
  BET_OBJECT_ENTERED: 'BET_OBJECT_ENTERED',
  BET_OBJECT_LEFT: 'BET_OBJECT_LEFT',
  initSocketConnection: (obj) => ({
    type: actions.INIT_SOCKET_CONNECTION_BET,
    payload: obj,
  }),
  sendTransaction: (obj) => ({
    type: actions.SEND_BET,
    payload: obj,
  }),
};

export default actions;
