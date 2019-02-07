const actions = {
  FETCH_REDEEM_TABLE: 'FETCH_REDEEM_TABLE',
  FETCH_REDEEM_TABLE_RESULT: 'FETCH_REDEEM_TABLE_RESULT',
  CLAIM_BUYBACK: 'CLAIM_BUYBACK',
  CLAIM_BUYBACK_RESULT: 'CLAIM_BUYBACK_RESULT',
  fetchRedeemTable: (obj) => ({
    type: actions.FETCH_REDEEM_TABLE,
    payload: obj,
  }),
  claimBuyback: (params) => ({
    type: actions.CLAIM_BUYBACK,
    payload: params,
  }),
};

export default actions;
