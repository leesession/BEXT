import { Map } from 'immutable';
import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  username: undefined,
  eosBalance: 0,
  betxBalance: 0,
  ebtcBalance: 0,
  eethBalance: 0,
  eusdBalance: 0,
  cpuUsage: undefined,
  netUsage: undefined,
  successMessage: undefined,
  errorMessage: undefined,
  ref: '', // Don't want undefined here
  isTopbarTransparent: true,
  dicePageData: undefined,
  stakePageData: undefined,
  buybackModalVisible: false,
  buybackModalParams: undefined,
});

export default function appReducer(state = initState, action) {
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
    case actions.GET_PAGE_DATA_RESULT:
      return state.set(`${action.name}PageData`, action.value);

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
    case actions.GET_EBTC_BALANCE_RESULT:
      return state.set('ebtcBalance', action.value);
    case actions.GET_EETH_BALANCE_RESULT:
      return state.set('eethBalance', action.value);
    case actions.GET_EUSD_BALANCE_RESULT:
      return state.set('eusdBalance', action.value);
    case actions.CLEAR_USER_INFO:
      return state.set('username', initState.get('username'))
        .set('cpuUsage', initState.get('cpuUsage'))
        .set('netUsage', initState.get('netUsage'))
        .set('eosBalance', initState.get('eosBalance'))
        .set('betxBalance', initState.get('betxBalance'))
        .set('ebtcBalance', initState.get('ebtcBalance'))
        .set('eethBalance', initState.get('eethBalance'))
        .set('eusdBalance', initState.get('eusdBalance'));
    case actions.SUCCESS_MESSAGE:
      return state.set('successMessage', action.message);
    case actions.ERROR_MESSAGE:
      return state.set('errorMessage', action.message);
    case actions.SET_REF:
      return state.set('ref', action.ref);
    case actions.TOGGLE_TOPBAR:
      return state.set('isTopbarTransparent', action.isTransparent);
    case actions.SET_BUYBACK_MODAL_VISIBILITY:
      return state.set('buybackModalVisible', action.value).set('buybackModalParams', action.payload);

    default:
      return state;
  }
  return state;
}
