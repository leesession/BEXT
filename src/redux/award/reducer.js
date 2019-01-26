import { Map } from 'immutable';

import actions from './actions';

const initState = new Map({
  redeems: [],
});

export default function (state = initState, action) {
  switch (action.type) {
    case actions.FETCH_REDEEM_TABLE_RESULT:

      return state
        .set('redeems', action.value);
    default:
      return state;
  }
}
