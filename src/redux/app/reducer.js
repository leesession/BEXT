import { Map } from 'immutable';
import _ from 'lodash';
import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();
const WALLET_ADDRESS_MAX_COUNT = 8;

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  username: undefined,
  eosBalance: undefined,
  betxBalance: undefined,
  successMessage: undefined,
  errorMessage: undefined,
  ref: '', // Don't want undefined here
  isTopbarTransparent: true,
});

export default function appReducer(state = initState, action) {
  if (_.isUndefined(action)) {
    console.log('appReducer.action is undefined;');
  }

  switch (action.type) {
    case actions.TOGGLE_ALL:
      if (state.get('view') !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return state
          .set('collapsed', action.collapsed)
          .set('view', action.view)
          .set('height', height);
      }
      break;
    case actions.GET_USERNAME_RESULT:
      return state.set('username', action.value);
    case actions.GET_CPU_USAGE_RESULT:
      return state.set('cpuUsage', action.value);
    case actions.GET_NET_USAGE_RESULT:
      return state.set('netUsage', action.value);
    case actions.GET_EOS_BALANCE_RESULT:
      return state.set('eosBalance', action.value);
    case actions.GET_BETX_BALANCE_RESULT:
      return state.set('betxBalance', action.value);
    case actions.SUCCESS_MESSAGE:
      return state.set('successMessage', action.message);
    case actions.CLEAR_SUCCESS_MESSAGE:
      return state.set('successMessage', undefined);
    case actions.ERROR_MESSAGE:
      return state.set('errorMessage', action.message);
    case actions.CLEAR_ERROR_MESSAGE:
      return state.set('errorMessage', undefined);
    case actions.SET_REF:
      return state.set('ref', action.ref);
    case actions.TOGGLE_TOPBAR:
      return state.set('isTopbarTransparent', action.isTransparent);
    default:
      return state;
  }
  return state;
}
