import Parse from 'parse';
import _ from 'lodash';
import Eos from 'eosjs';

import { appConfig, parseConfig } from '../settings';

Parse.initialize(parseConfig.appId, parseConfig.javascriptKey, '0x2d2e81f6db11144f9a51c1bac41b4ebffecec391c19d74322b2a8917da357208');
Parse.serverURL = parseConfig.serverURL;
Parse.masterKey = '0x2d2e81f6db11144f9a51c1bac41b4ebffecec391c19d74322b2a8917da357208';

const ParseProject = Parse.Object.extend('Project');
const ParseMessage = Parse.Object.extend('Message');
const ParseBet = Parse.Object.extend('Bet');

const PARSE_ERROR = {
  // SETTINGS_INVALID: 'Firebase Config apiKey or projectId not configured.',
  // PROVIDER_NOT_FOUND: 'No auth provider found for firebase',
};

const STATUS ={
  NOT_STARTED: "Not Started",
  RESOLVED: "Resolved",
}

class ParseHelper {
  constructor() {
    this.parse = Parse;
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getProjectData = this.getProjectData.bind(this);
    this.getProjectList = this.getProjectList.bind(this);
    this.sendEmailVerification = this.sendEmailVerification.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.fetchBetHistory = this.fetchBetHistory.bind(this);
    this.fetchChatHistory = this.fetchChatHistory.bind(this);
    this.handleParseError = this.handleParseError.bind(this);
    this.parseBetReceipt = this.parseBetReceipt.bind(this);
    this.getBetVolume = this.getBetVolume.bind(this);
    this.getBetxStakeAmount = this.getBetxStakeAmount.bind(this);
  }

  /**
   * Prepare receipt data for view to render
   * @param  {[type]} parseObject [description]
   * @return {[type]}             [description]
   */
  parseBetReceipt(parseObject) {
  // Skip any bet that doesn't have a receipt object
    if (parseObject.get('status') !== STATUS.RESOLVED) {
      return undefined;
    }

    const payoutAsset = parseObject.get('payout') && Eos.modules.format.parseAsset(parseObject.get('payout'));
    const resolveTrxId = parseObject.get("receipt") && parseObject.get("receipt").trx_id;

    return {
      id: parseObject.id,
      time: parseObject.get('resolved_block_time'),
      bettor: parseObject.get('bettor'),
      rollUnder: parseObject.get('roll_under'),
      betAmount: parseObject.get('bet_amt'),
      roll: parseObject.get('roll'),
      transferTx: parseObject.get("transferTx"),
      payout: (_.isUndefined(payoutAsset) || _.toNumber(payoutAsset.amount) === 0) ? "": parseObject.get('payout'),
      payoutAsset: {
        amount: payoutAsset && _.toNumber(payoutAsset.amount),
        symbol: payoutAsset && payoutAsset.symbol,
      },
      resolvedBlockNum: parseObject.get('resolved_block_num'),
      trxUrl: `https://eostracker.io/transactions/${parseObject.get('resolved_block_num')}/${resolveTrxId}`,
    };
  }


  login(credential) {
    return this.parse.User.logIn(credential.email, credential.password);
  }

  signup(credential) {
    if (_.isUndefined(credential)) {
      throw new Error('ParseHelper.signup: credential objection is undefined');
    }

    const user = new this.parse.User();

    user.set('username', credential.email);
    user.set('password', credential.password);
    user.set('email', credential.email);

    return user.signUp();
  }

  logout() {
    return this.parse.User.logOut();
  }

  isAuthenticated() {
    return this.firebaseAuth().onAuthStateChanged((user) => (!!user));
  }

  getCurrentUser() {
    return this.parse.User.current();
  }

  resetPassword(email) {
    // return this.firebaseAuth().sendPasswordResetEmail(email);
  }

  sendEmailVerification() {
    // const user = this.firebaseAuth().currentUser;

    // if (!user) {
    //   throw new Error('User is not logged in.');
    // }

    // return user.sendEmailVerification();
  }

  mapParseObjectToJson(parseProject) {
    return {
      Details: parseProject.get('Details'),
      additional: parseProject.get('additional'),
      allocation: parseProject.get('allocation'),
      circulatingSupply: parseProject.get('circulatingSupply'),
      hardcap: parseProject.get('hardcap'),
      id: parseProject.get('id'),
      images: parseProject.get('images'),
      keywords: parseProject.get('keywords'),
      name: parseProject.get('name'),
      price: parseProject.get('price'),
      raisedAmount: parseProject.get('raisedAmount'),
      screenshots: parseProject.get('screenshots'),
      status: parseProject.get('status'),
      summary: parseProject.get('summary'),
      team: parseProject.get('team'),
      ticker: parseProject.get('ticker'),
      title: parseProject.get('title'),
      totalAmount: parseProject.get('totalAmount'),
      totalSupply: parseProject.get('totalSupply'),
      valuation: parseProject.get('valuation'),
      website: parseProject.get('website'),
      whitepaper: parseProject.get('whitepaper'),
      dates: parseProject.get('dates'),
      news: parseProject.get('news'),
      rating: parseProject.get('rating'),
    };
  }

  getProjectData(name) {
    const that = this;

    const query = new Parse.Query(ParseProject);

    query.equalTo('id', name);

    return query.first().then((parseProject) => (that.mapParseObjectToJson(parseProject)));
    // return this.parse.Cloud.run('project', { name });
  }

  getProjectList() {
    const that = this;

    const query = new Parse.Query(ParseProject);

    query.equalTo('status', 'active');

    return query.find()
      .then((entries) => _.sortBy(_.map(entries, (parseProject) => (that.mapParseObjectToJson(parseProject))), [function (o) { return o.dates && o.dates.start; }]));
  }

  forgetPassword(obj) {
    console.log('parse.forgetPassword.obj', obj);
    const { email } = obj;
    return Parse.User.requestPasswordReset(email);
  }

  getMessageItems(payload) {
    const messageQuery1 = new Parse.Query(ParseMessage);
    const messageQuery2 = new Parse.Query(ParseMessage);
    const userPointer = {
      __type: 'Pointer',
      className: '_User',
      objectId: payload.user.objectId, // current users Id
    };

      // user could be in either column so we will use a compound query
    messageQuery1.equalTo('user1', userPointer);
    messageQuery2.equalTo('user2', userPointer);
    // the compound query using "or"
    const mainQuery = Parse.Query.or(messageQuery1, messageQuery2);
    // include the users data so we can use their name in the UI
    mainQuery.include('user1');
    mainQuery.include('user2');
    // return a promise with users chat rooms
    return mainQuery.find();
  }

  // accepts chat payload object containing user1 and user2
  subscribe(collection) {
    const query = new Parse.Query(collection);
    // let user1Pointer = {
    //   __type:"Pointer",
    //   className:"_User",
    //   objectId:payload.user1.objectId
    // }
    // let user2Pointer = {
    //   __type:"Pointer",
    //   className:"_User",
    //   objectId:payload.user2.objectId
    // }
    // messageQuery.equalTo("user1", user1Pointer);
    // messageQuery.equalTo("user2", user2Pointer);

    const subscription = query.subscribe();
    return subscription;
  }

  // accepts chat payload object containing user1 and user2
  unsubscribe(subscription) {
    console.log('unsubscribing', subscription);
    subscription.unsubscribe();
  }

  sendMessage(messageObj) {
    const message = new ParseMessage();
    message.set('type', 'user');
    message.set('username', messageObj.username);
    message.set('body', messageObj.body);

    return message.save({}, { useMasterKey: true });
  }

  fetchBetHistory() {
    const { parseBetReceipt } = this;
    const query = new Parse.Query(ParseBet);
    query.equalTo('status', STATUS.RESOLVED);
    query.descending("resolved_block_num");
    query.limit(appConfig.betHistoryMemorySize);

    // Bet history need to be inserted to the queue in ascending order, so we need to reserve the array here
    return query.find().then((results) => Promise.resolve(_.reverse(_.filter(
      _.map(results, (entry) => parseBetReceipt(entry)),
      (o) => !_.isUndefined(o)
    ))));
  }

  fetchChatHistory() {
    const query = new Parse.Query(ParseMessage);
    query.descending("updatedAt");
    query.limit(appConfig.chatHistoryMemorySize);

// Chat history need to be inserted to the queue in ascending order, so we need to reserve the array here
    return query.find().then((results=> Promise.resolve(_.reverse(results))));
  }

  getBetVolume(){
    return this.parse.Cloud.run('getBetVolume', {types:["day", "all"]});
  }

  getBetxStakeAmount(){
  return this.parse.Cloud.run('getBetxStakeAmount');
  }

  handleParseError(err) {
    const message = 'error.parse.default';

    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        return Parse.User.logOut();
        // Other Parse API errors that you want to explicitly handle
      default:
        break;
    }

    return message;
  }
}


export default new ParseHelper();
