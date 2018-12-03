export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

const actions = {
  TOGGLE_ALL: 'TOGGLE_ALL',
  GET_IDENTITY: 'GET_IDENTITY',
  GET_IDENTITY_RESULT: 'GET_IDENTITY_RESULT',
  GET_USERNAME_RESULT: 'GET_USERNAME_RESULT',
  GET_BALANCES: "GET_BALANCES",
  GET_EOS_BALANCE_RESULT: 'GET_EOS_BALANCE_RESULT',
  GET_BETX_BALANCE_RESULT: 'GET_BETX_BALANCE_RESULT',
  TRANSFER_REQUEST: 'TRANSFER_REQUEST',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  SUCCESS_MESSAGE: 'SUCCESS_MESSAGE',
  CLEAR_SUCCESS_MESSAGE: 'CLEAR_SUCCESS_MESSAGE',
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
  CLEAR_ERROR_MESSAGE: 'CLEAR_ERROR_MESSAGE',
  SET_REF: 'SET_REF',
  TOGGLE_TOPBAR: 'TOGGLE_TOPBAR',
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height,
    };
  },
  getIdentity: () => ({
    type: actions.GET_IDENTITY,
  }),
  transfer: (params) => ({
    type: actions.TRANSFER_REQUEST,
    payload: params,
  }),
  setErrorMessage: (message) => ({
    type: actions.SET_ERROR_MESSAGE,
    message,
  }),
  setRef: (params) => ({
    type: actions.SET_REF,
    ref: params,
  }),
  toggleTopbar: (isTransparent) => ({
    type: actions.TOGGLE_TOPBAR,
    isTransparent,
  }),
  getBalances: (name) =>({
    type: actions.GET_BALANCES,
    name
  })
};

export default actions;
