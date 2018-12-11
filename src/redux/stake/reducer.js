import { Map } from 'immutable';
import actions from './actions';


const initState = new Map({
  mySnapshotTotal: 0,
  contractSnapshotTotal: 0,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_MY_SNAPSHOT_TOTAL:
      return state.set('mySnapshotTotal', action.value);
    case actions.GET_CONTRACT_SNAPSHOT_TOTAL:
      return state.set('contractSnapshotTotal', action.value);
    default:
      return state;
  }
  return state;
}
