import { Map } from 'immutable';
import _ from 'lodash';
import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();
console.log(`preKeys is ${preKeys}`);
const WALLET_ADDRESS_MAX_COUNT = 8;

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  username: undefined,
  balance: undefined,
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
    case actions.GET_USERNAME_RESULT:
      return state.set('username', action.value);
    case actions.GET_EOS_BALANCE_RESULT:
      return state.set('eosBalance', action.value);
    case actions.GET_BETX_BALANCE_RESULT:
      return state.set('betxBalance', action.value);
    case actions.TRANSER_RESULT:
      return state.set('transferResult', action.value);
    default:
      return state;
  }
  return state;
}
