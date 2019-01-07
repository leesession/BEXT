import { Map } from 'immutable';
import actions from './actions';
import appActions from '../app/actions';

const initState = new Map({
  mySnapshotTotal: 0,
  mySnapshotEffective: 0,
  myDividend: 0,
  myFrozen: 0,
  myAvailable: 0,
  myStake: 0,
  contractSnapshotTotal: 0,
  betxCirculation: 0,
  todayDividend: 0,
});

export default function stakeReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_MY_STAKE_AND_DIVID_RESULT:
      return state.set('mySnapshotTotal', action.value && action.value.ssTotal)
        .set('mySnapshotEffective', action.value && action.value.ssEffective)
        .set('myDividend', action.value && action.value.dividend)
        .set('myStake', action.value && action.value.stake)
        .set('myFrozen', action.value && action.value.frozen)
        .set('myAvailable', action.value && action.value.available);

    case actions.GET_CONTRACT_SNAPSHOT_RESULT:
      return state.set('contractSnapshotTotal', action.value && action.value.effective)
        .set('snapshotUserCount', action.value && action.value.userCount);

    case actions.GET_CONTRACT_DIVIDEND_RESULT:
      return state.set('contractDividend', action.value && action.value.dividend)
        .set('contractStake', action.value && action.value.stake);

    case actions.GET_TODAY_DIVIDEND_RESULT:
      return state.set('todayDividend', action.value);

    case actions.GET_BETX_CIRCULATION_RESULT:
      return state.set('betxCirculation', action.value);

    case appActions.CLEAR_USER_INFO:
      return state.set('mySnapshotTotal', initState.mySnapshotTotal)
        .set('mySnapshotEffective', initState.mySnapshotEffective)
        .set('myDividend', initState.myDividend)
        .set('myStake', initState.myStake)
        .set('myFrozen', initState.myFrozen)
        .set('myAvailable', initState.myAvailable);

    default:
      return state;
  }
}
