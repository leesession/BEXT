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
  GET_EOS_BALANCE_RESULT: 'GET_EOS_BALANCE_RESULT',
  GET_BETX_BALANCE_RESULT: 'GET_BETX_BALANCE_RESULT',
  TRANSFER_REQUEST: 'TRANSFER_REQUEST',
  TRANSFER_RESULT: 'TRANSFER_RESULT',
  SET_REF: 'SET_REF',
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
  setRef: (params)=>({
    type: actions.SET_REF,
    ref: params,
  }),
};

export default actions;
