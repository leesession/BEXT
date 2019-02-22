const actions = {

  GET_MY_STAKE_AND_DIVID: 'GET_MY_STAKE_AND_DIVID',
  GET_MY_STAKE_AND_DIVID_RESULT: 'GET_MY_STAKE_AND_DIVID_RESULT',
  STAKE: 'STAKE',
  STAKE_RESULT: 'STAKE_RESULT',
  UNSTAKE: 'UNSTAKE',
  UNSTAKE_RESULT: 'UNSTAKE_RESULT',
  CLAIM_DIVIDEND: 'CLAIM_DIVIDEND',
  CLAIM_DIVIDEND_RESULT: 'CLAIM_DIVIDEND_RESULT',
  WITHDRAW: 'WITHDRAW',
  WITHDRAW_RESULT: 'WITHDRAW_RESULT',

  stake: (params) => ({
    type: actions.STAKE,
    payload: params,
  }),
  unstake: (params) => ({
    type: actions.UNSTAKE,
    payload: params,
  }),
  getMyStakeAndDividend: (username) => ({
    type: actions.GET_MY_STAKE_AND_DIVID,
    username,
  }),
  claimDividend: (params) => ({
    type: actions.CLAIM_DIVIDEND,
    payload: params,
  }),
  withdraw: (params) => ({
    type: actions.WITHDRAW,
    payload: params,
  }),
};

export default actions;
