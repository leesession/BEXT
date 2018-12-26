const actions = {

  GET_MY_STAKE_AND_DIVID: 'GET_MY_STAKE_AND_DIVID',
  GET_MY_STAKE_AND_DIVID_RESULT: 'GET_MY_STAKE_AND_DIVID_RESULT',
  GET_CONTRACT_SNAPSHOT: 'GET_CONTRACT_SNAPSHOT',
  GET_CONTRACT_SNAPSHOT_RESULT: 'GET_CONTRACT_SNAPSHOT_RESULT',
  GET_CONTRACT_DIVIDEND: 'GET_CONTRACT_DIVIDEND',
  GET_CONTRACT_DIVIDEND_RESULT: 'GET_CONTRACT_DIVIDEND_RESULT',
  GET_TODAY_DIVIDEND: 'GET_TODAY_DIVIDEND',
  GET_TODAY_DIVIDEND_RESULT: 'GET_TODAY_DIVIDEND_RESULT',
  STAKE: 'STAKE',
  STAKE_RESULT: 'STAKE_RESULT',
  UNSTAKE: 'UNSTAKE',
  UNSTAKE_RESULT: 'UNSTAKE_RESULT',
  GET_BETX_CIRCULATION: 'GET_BETX_CIRCULATION',
  GET_BETX_CIRCULATION_RESULT: 'GET_BETX_CIRCULATION_RESULT',
  CLAIM_DIVIDEND: 'CLAIM_DIVIDEND',
  CLAIM_DIVIDEND_RESULT: 'CLAIM_DIVIDEND_RESULT',

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

  getContractSnapshot: () => ({
    type: actions.GET_CONTRACT_SNAPSHOT,
  }),
  getContractDividend: () => ({
    type: actions.GET_CONTRACT_DIVIDEND,
  }),

  getBETXCirculation: () => ({
    type: actions.GET_BETX_CIRCULATION,
  }),

  claimDividend: (params) => ({
    type: actions.CLAIM_DIVIDEND,
    payload: params,
  }),

  getTodayDividend: () => ({
    type: actions.GET_TODAY_DIVIDEND,
  }),
};

export default actions;
