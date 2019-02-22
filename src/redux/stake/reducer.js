import { Map } from 'immutable';
import actions from './actions';
import appActions from '../app/actions';

const initState = new Map({
  myDividend: 0,
  myFrozen: 0,
  myAvailable: 0,
  myStake: 0,
});

export default function stakeReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_MY_STAKE_AND_DIVID_RESULT:
      return state.set('myDividend', action.value && action.value.dividend)
        .set('myStake', action.value && action.value.stake)
        .set('myFrozen', action.value && action.value.frozen)
        .set('myAvailable', action.value && action.value.available);

    case appActions.CLEAR_USER_INFO:
      return state.set('myDividend', initState.myDividend)
        .set('myStake', initState.myStake)
        .set('myFrozen', initState.myFrozen)
        .set('myAvailable', initState.myAvailable);

    default:
      return state;
  }
}
