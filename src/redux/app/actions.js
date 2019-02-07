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
  GET_PAGE_DATA: 'GET_PAGE_DATA',
  GET_PAGE_DATA_RESULT: 'GET_PAGE_DATA_RESULT',
  GET_IDENTITY: 'GET_IDENTITY',
  GET_IDENTITY_RESULT: 'GET_IDENTITY_RESULT',
  LOG_OUT: 'LOG_OUT',
  CLEAR_USER_INFO: 'CLEAR_USER_INFO',
  GET_USERNAME_RESULT: 'GET_USERNAME_RESULT',
  GET_BALANCES: 'GET_BALANCES',
  GET_ACCOUNT: 'GET_ACCOUNT',
  GET_CPU_USAGE_RESULT: 'GET_CPU_USAGE_RESULT',
  GET_NET_USAGE_RESULT: 'GET_NET_USAGE_RESULT',
  GET_EOS_BALANCE_RESULT: 'GET_EOS_BALANCE_RESULT',
  GET_BETX_BALANCE_RESULT: 'GET_BETX_BALANCE_RESULT',
  GET_EBTC_BALANCE_RESULT: 'GET_EBTC_BALANCE_RESULT',
  GET_EETH_BALANCE_RESULT: 'GET_EETH_BALANCE_RESULT',
  GET_EUSD_BALANCE_RESULT: 'GET_EUSD_BALANCE_RESULT',
  TRANSFER_REQUEST: 'TRANSFER_REQUEST',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  SUCCESS_MESSAGE: 'SUCCESS_MESSAGE',
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
  SET_REF: 'SET_REF',
  TOGGLE_TOPBAR: 'TOGGLE_TOPBAR',
  SET_BUYBACK_MODAL_VISIBILITY: 'SET_BUYBACK_MODAL_VISIBILITY',
  BUYBACK_MODAL_VISIBLE: 'BUYBACK_MODAL_VISIBLE',
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
  getPageData: (name) => ({
    type: actions.GET_PAGE_DATA,
    name,
  }),
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
  setSuccessMessage: (message) => ({
    type: actions.SET_SUCCESS_MESSAGE,
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
  getAccountInfo: (name) => ({
    type: actions.GET_ACCOUNT,
    name,
  }),
  getBalances: (name) => ({
    type: actions.GET_BALANCES,
    name,
  }),
  logout: () => ({
    type: actions.LOG_OUT,
  }),
  setBuybackModalVisibility: (value, params) => ({
    type: actions.SET_BUYBACK_MODAL_VISIBILITY,
    value,
    payload: params,
  }),
};

export default actions;
