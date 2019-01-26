const actions = {
  FETCH_REDEEM_TABLE: 'FETCH_REDEEM_TABLE',
  FETCH_REDEEM_TABLE_RESULT: 'FETCH_REDEEM_TABLE_RESULT',

  fetchRedeemTable: (obj) => ({
    type: actions.FETCH_REDEEM_TABLE,
    payload: obj,
  }),
};

export default actions;
