/* eslint react/no-array-index-key: 0, no-nested-ternary: 0, react/no-unused-prop-types: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';
import { Icon, Row, Col, Table, Input, Button, Tabs, Popover, message } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'animate.css/animate.min.css';

import ReactNotification from '../components/react-notification-component';
import '../components/react-notification-component/less/notification.less';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';

import Slider from '../components/slider';
import Dice from '../components/dice';
import Chatroom from '../components/chatroom';
import betActions from '../redux/bet/actions';
import appActions from '../redux/app/actions';
import IntlMessages from '../components/utility/intlMessages';
import { appConfig } from '../settings';
import { randomString } from '../helpers/utility';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const { TabPane } = Tabs;
const MAX_BALANCE_STR = 'MAX';
const MIN_ROLL_NUMBER = 1;
const MIN_SELECT_ROLL_NUMBER = 2;
const MAX_ROLL_NUMBER = 100;
const MAX_SELECT_ROLL_NUMBER = 96;
const DEFAULT_ROLL_NUMBER = 50;
const DIVIDEND = 0.98;

const MIN_INPUT_BET_AMOUNT = 0.1;
const MAX_INPUT_BET_AMOUNT = 50;
const MAX_FLOAT_DIGITS = 4;

const { initSocketConnection, fetchBetHistory, deleteCurrentBet } = betActions;
const {
  getIdentity, getAccountInfo, getBalances, transfer, setErrorMessage,
} = appActions;

function calculateWinChance(rollNumber) {
  return (rollNumber - MIN_ROLL_NUMBER) / ((MAX_ROLL_NUMBER - MIN_ROLL_NUMBER) + 1);
}

function calculatePayout(winChance) {
  return DIVIDEND / winChance;
}

function calculatePayoutOnWin(betAmount, payout) {
  return betAmount * payout;
}


class DicePage extends React.Component {
  constructor(props) {
    super(props);

    const betAmount = 1;
    const rollNumber = DEFAULT_ROLL_NUMBER;
    const winChance = calculateWinChance(rollNumber);
    const payout = calculatePayout(winChance);
    const payoutOnWin = calculatePayoutOnWin(betAmount, payout);
    const { intl } = this.props;

    this.defaultUsername = `Guest-${_.random(100000, 999999, false)}`;
    this.state = {

      betAmount,
      rollNumber,
      payout,
      payoutOnWin,
      winChance,
      eosBalance: 0,
      betxBalance: 0,
      username: this.defaultUsername,
      betAsset: 'EOS',
      seed: undefined,
      notifications: [],
    };

    this.desktopColumns = [{
      title: intl.formatMessage({ id: 'dice.history.form.time' }),
      dataIndex: 'time',
      key: 'time',
    }, {
      title: intl.formatMessage({ id: 'dice.history.form.bettor' }),
      dataIndex: 'bettor',
      key: 'bettor',
    }, {
      title: intl.formatMessage({ id: 'dice.history.form.unber' }),
      dataIndex: 'rollUnder',
      key: 'rollUnder',
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.bet' }),
      dataIndex: 'betAmount',
      key: 'betAmount',
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.roll' }),
      dataIndex: 'roll',
      key: 'roll',
      render: (text) => (
        <span style={{ color: '#e6c36b' }}>{text}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.payout' }),
      dataIndex: 'payout',
      key: 'payout',
      render: (text) => text ? <span style={{ color: 'lightgreen' }}>{text}</span> : '',
    },
    {
      title: '',
      dataIndex: 'trxUrl',
      key: 'trxUrl',
      render: (text) => (
        <a href={text} target="_blank" style={{ color: 'white' }}><Icon type="right" /></a>
      ),
    },
    ];

    this.mobileColumns = [{
      title: intl.formatMessage({ id: 'dice.history.form.time' }),
      dataIndex: 'time',
      key: 'time',
      width: 105,
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.bettor' }),
      dataIndex: 'bettor',
      key: 'bettor',
      width: 105,
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.payout' }),
      dataIndex: 'payout',
      key: 'payout',
      width: 105,
      render: (text) => (text ? <span style={{ color: 'lightgreen' }}>{text}</span> : <span></span>),
    },
    ];

    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.onBetAmountButtonClick = this.onBetAmountButtonClick.bind(this);
    this.getSliderValue = this.getSliderValue.bind(this);
    this.onBetClicked = this.onBetClicked.bind(this);
    this.onLogInClicked = this.onLogInClicked.bind(this);
    this.formatBetAmountStr = this.formatBetAmountStr.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  componentWillMount() {
    const { fetchBetHistoryReq } = this.props;

    fetchBetHistoryReq();
  }

  componentDidMount() {
    const { initSocketConnectionReq } = this.props;
    initSocketConnectionReq({ collection: 'Bet' });
  }

  componentWillReceiveProps(nextProps) {
    const {
      username, eosBalance, betxBalance, currentBets,
    } = nextProps;

    const {
      intl, deleteCurrentBetReq, getBalancesReq, getAccountInfoReq,
    } = this.props;
    const { notifications, username: stateUsername } = this.state;
    const { notificationDOMRef } = this;

    const fieldsToUpdate = {};

    // Update username in state if we received one from props; this means Scatter login succeeded
    if (username) {
      fieldsToUpdate.username = username;
    }

    if (_.isNumber(eosBalance)) {
      fieldsToUpdate.eosBalance = eosBalance;
    }

    if (_.isNumber(betxBalance)) {
      fieldsToUpdate.betxBalance = betxBalance;
    }

    // console.log('componentWillReceiveProps.currentBets', currentBets);

    _.each(currentBets, (bet) => {
      const existingNotification = _.find(notifications, { transactionId: bet.transactionId });

      const titleEle = <p className="notification-title">{intl.formatMessage({ id: 'message.success.sentBet' }, { betAmount: bet.betAmount })}</p>;

      // Add a new notification is the new bet doesn't have one yet.
      if (_.isUndefined(existingNotification)) {
        const messageEle = <p className="notification-message">{intl.formatMessage({ id: 'message.success.waitForBetResult' })}</p>;
        const notificationId = notificationDOMRef.current.addNotification({
          isMobile: true,
          type: 'custom',
          content: <div className="bet-notification-container">
            <div className="bet-notification-container-dice">
              <Dice />
            </div>
            <div className="bet-notification-container-text">
              {titleEle}
              {messageEle}
            </div></div>,
          insert: 'top',
          container: 'top-center',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismissable: { click: false, touch: false },
          width: 550,
        });

        notifications.push({ notificationId, transactionId: bet.transactionId });
      } else if (bet.isResolved) { // Found existing notification of this bet
        const { notificationId, transactionId } = existingNotification;

        if (!notificationId) { // Can't proceed if notificationId is null
          return;
        }

        const containerClass = classNames({
          'bet-notification-container': true,
          'bet-notification-container-lose': !bet.isWon,
        });

        const messageWin = intl.formatMessage({
          id: 'message.success.resultWon',
        }, { roll: bet.roll, payout: bet.payout });

        const messageLose = intl.formatMessage({
          id: 'message.success.resultLose',
        }, { roll: bet.roll, betAmount: bet.betAmount });

        const messageEle = <p className="notification-message">{bet.isWon ? messageWin : messageLose}</p>;

        notificationDOMRef.current.updateNotificationOptions(
          notificationId,
          {
            dismiss: { duration: 5000 },
            content: <div className={containerClass}>
              <div className="bet-notification-container-dice">
                <Dice className="stop-animation" />
              </div>
              <div className="bet-notification-container-text">
                {titleEle}
                {messageEle}
              </div>
            </div>,
          }
        );

        setTimeout(() => {
          if (!notificationDOMRef.current) { return; }
          // Remove this notification from notification componnent
          notificationDOMRef.current.removeNotification(notificationId);
          // Remove this notification from this.state
          _.remove(notifications, { notificationId });

          // Remove this notification from state store currentBets
          deleteCurrentBetReq(transactionId);

          getAccountInfoReq(stateUsername);
          getBalancesReq(stateUsername);
        }, 5000);
      }
    });

    fieldsToUpdate.notifications = notifications;

    this.setState(fieldsToUpdate);
  }

  componentWillUnmount() {
  }

  onInputNumberChange(evt) {
    const { payout, betAsset } = this.state;
    const { intl } = this.props;
    const { formatBetAmountStr } = this;

    const { value } = evt.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

    if (value === '' || value[value.length - 1] === '.') {
      this.setState({
        betAmount: value,
      });

      return;
    }

    if ((!_.isNaN(value) && reg.test(value))) {
      if (_.toNumber(value) < MIN_INPUT_BET_AMOUNT) {
        message.warning(intl.formatMessage({
          id: 'message.warn.lessThanMinBet',
        }, {
          amount: MIN_INPUT_BET_AMOUNT.toFixed(4),
          asset: betAsset,
        }));
      }

      const betAmount = formatBetAmountStr(value);
      const payoutOnWin = calculatePayoutOnWin(betAmount, payout);

      this.setState({
        betAmount,
        payoutOnWin,
      });
    }
  }

  onBetAmountButtonClick(e) {
    const {
      eosBalance: balance, betAmount, payout, username,
    } = this.state;
    const { formatBetAmountStr } = this;
    const targetValue = e.currentTarget.getAttribute('data-value');
    let newBetAmount = _.toNumber(betAmount);

    if (targetValue === MAX_BALANCE_STR) { // For "MAX" case
      if (username === this.defaultUsername) {
        message.warning(this.props.intl.formatMessage({
          id: 'message.warn.loginFirst',
        }));
        return;
      }
      newBetAmount = balance;
    } else if (targetValue === '1' || targetValue === '-1') { // For +1 and -1 cases; don't set upper limit with balance;
      newBetAmount = _.toNumber(betAmount) + _.toNumber(targetValue);
    } else if (targetValue === '0.5' || targetValue === '2') { // For 0.5x and 2x cases; set upper limit with balance;
      newBetAmount = _.toNumber(betAmount) * _.toNumber(targetValue);
    }

    // newBetAmount is a number. Don't forget to change it with toString here.
    newBetAmount = formatBetAmountStr(newBetAmount.toString());
    const payoutOnWin = calculatePayoutOnWin(newBetAmount, payout);

    this.setState({
      betAmount: newBetAmount,
      payoutOnWin,
    });
  }

  getSliderValue(value) {
    const { betAmount } = this.state;

    const winChance = calculateWinChance(value);
    const payout = calculatePayout(winChance);
    const payoutOnWin = calculatePayoutOnWin(betAmount, payout);

    this.setState({
      rollNumber: value,
      winChance,
      payout,
      payoutOnWin,
    });
  }

  onLogInClicked() {
    const { getIdentityReq } = this.props;
    getIdentityReq();
  }

  onBetClicked() {
    const {
      rollNumber, username, betAmount, betAsset, seed,
    } = this.state;
    const { transferReq, setErrorMessageReq, referrer } = this.props;

    if (username === this.defaultUsername) {
      setErrorMessageReq('error.page.usernamenotfound');
      return;
    }

    transferReq({
      bettor: username,
      betAmount,
      betAsset,
      rollUnder: rollNumber,
      referrer,
      seed: seed || randomString(16), // We haven't set up a function for user custom seed
    });
  }

  /**
 * Restrict bet amount to be in certain range
 * @return {[type]} [description]
 */
  formatBetAmountStr(betAmountStr) {
    const { balance, betAsset } = this.state;
    const { intl } = this.props;

    const lowBound = MIN_INPUT_BET_AMOUNT;
    const highBound = _.min([MAX_INPUT_BET_AMOUNT, balance]);
    _.clamp(_.toNumber(betAmountStr), lowBound, highBound);

    if (_.toNumber(betAmountStr) < lowBound) {
      message.warning(intl.formatMessage({
        id: 'message.warn.lessThanMinBet',
      }, {
        amount: MIN_INPUT_BET_AMOUNT,
        asset: betAsset,
      }));

      return lowBound;
    } else if (_.toNumber(betAmountStr) > highBound) {
      message.warning(intl.formatMessage({
        id: 'message.warn.greaterThanMaxBet',
      }, {
        amount: MAX_INPUT_BET_AMOUNT,
        asset: betAsset,
      }));
      return highBound;
    }

    const parts = betAmountStr.split('.');

    if (parts.length <= 1) {
      return betAmountStr;
    }
    return `${parts[0]}.${parts[1].substring(0, MAX_FLOAT_DIGITS)}`;
  }

  render() {
    const { desktopColumns, mobileColumns } = this;
    const {
      betAmount, payoutOnWin, winChance, payout, rollNumber, eosBalance, betxBalance, username,
    } = this.state;

    const { betHistory, locale, view } = this.props;


    const momentLocale = (locale === 'en') ? 'en' : 'zh-cn';

    const rawBetData = _.isEmpty(betHistory.all()) ? [] : _.reverse(_.map(betHistory.all(), (bet) => ({
      key: bet.id,
      time: moment(bet.time).locale(momentLocale).format('HH:mm:ss'),
      bettor: bet.bettor,
      rollUnder: bet.rollUnder,
      betAmount: bet.betAmount,
      roll: bet.roll,
      payout: bet.payout,
      payoutAsset: bet.payoutAsset,
      trxUrl: bet.trxUrl,
    })));

    const allBetData = _.slice(rawBetData, 0, appConfig.betHistoryTableSize);

    const myBetData = _.slice(_.filter(rawBetData, (o) => o.bettor === username), 0, appConfig.betHistoryTableSize);
    const hugeBetData = _.slice(_.filter(rawBetData, (o) => o.payoutAsset.amount >= appConfig.hugeBetAmount), 0, appConfig.betHistoryTableSize);

    const columns = view === 'MobileView' ? mobileColumns : desktopColumns;

    return (
      <div>
        <div id="dicepage">
          <div className="wrapper">
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <section>
                  {/* <div className="horizontalWrapper"> */}
                  <div className="container">
                    <ReactNotification ref={this.notificationDOMRef} />
                    <div className="holderBorder">

                      <div className="container-top">
                        <Row>
                          <Col span={24}>
                            <div className="currency-switch">
                              <div className="currency-switch-btns">
                                <Button size="large" className="bet_button active" type="default" data-value="EOS">EOS
                                </Button>
                                <Popover content={(<IntlMessages id="dice.alert.comingsoon" />)}>
                                  <Button size="large" className="bet_button" type="default" data-value="BETX" >BETX
                                  </Button>
                                </Popover>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="action">

                        <Row type="flex" gutter={0}>
                          <Col span={8}>
                            <div className="box box-label">
                              <div className="box-inner">
                                <div className="label"><IntlMessages id="dice.play.notice" />
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div className="box box-label">
                              <div className="box-inner">
                                <div className="label"><IntlMessages id="dice.play.payout" />
                                </div>
                              </div>
                            </div>

                          </Col>
                          <Col span={8}>
                            <div className="box box-label">
                              <div className="box-inner">
                                <div className="label"><IntlMessages id="dice.play.win" />
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div className="box box-value">
                              <div className="box-inner">
                                <div className="value">{rollNumber}↓
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div className="box box-value">
                              <div className="box-inner">
                                <div className="value ratio">{_.floor(payout, 3)}X
                                </div>
                              </div>
                            </div>

                          </Col>
                          <Col span={8}>
                            <div className="box box-value">
                              <div className="box-inner">
                                <div className="value">{(_.floor(winChance, 4) * 100).toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row type="flex" justify="center">
                          <Col span={24}>
                            <Slider getValue={this.getSliderValue} defaultValue={DEFAULT_ROLL_NUMBER} min={MIN_SELECT_ROLL_NUMBER} max={MAX_SELECT_ROLL_NUMBER} step={1} />
                          </Col>
                        </Row>

                        <Row className="input-group-container" type="flex" justify="center" align="middle">
                          <Col xs={{ span: 12, order: 2 }} lg={{ span: 8, order: 1 }} >

                            <div className="box box-input">
                              <div className="box-inner">
                                <Row type="flex" justify="center" align="middle">
                                  <Col span={16}>
                                    <div className="box-input-inner">
                                      <span className="label"><IntlMessages id="dice.play.amount" /></span>
                                      <Input size="large" className="inputBorder" onChange={this.onInputNumberChange} value={betAmount} />
                                    </div>
                                  </Col>
                                  <Col span={8}>
                                    <button className="box-input-round-btn" onClick={this.onBetAmountButtonClick} data-value="1">+</button>
                                    <button className="box-input-round-btn" onClick={this.onBetAmountButtonClick} data-value="-1">-</button>
                                  </Col>

                                </Row>
                              </div>
                            </div>
                          </Col>
                          <Col xs={{ span: 24, order: 1 }} lg={{ span: 8, order: 2 }} >
                            <div className="box box-input">
                              <div className="box-inner">

                                <div className="inputBorder">
                                  <Row>
                                    <Col span={8}>
                                      <Button size="large" className="box-input-button" type="default" onClick={this.onBetAmountButtonClick} data-value="0.5" >1/2
                                      </Button>
                                    </Col>
                                    <Col span={8}>
                                      <Button size="large" className="box-input-button" type="default" onClick={this.onBetAmountButtonClick} data-value="2" >2X
                                      </Button>
                                    </Col>
                                    <Col span={8}>
                                      <Button size="large" className="box-input-button" type="default" onClick={this.onBetAmountButtonClick} data-value={MAX_BALANCE_STR} >{MAX_BALANCE_STR}
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col xs={{ span: 12, order: 3 }} lg={{ span: 8, order: 3 }} >
                            <div className="box box-input">
                              <div className="box-inner">
                                <div className="box-input-inner box-input-inner-reward">
                                  <span className="label"><IntlMessages id="dice.reward.total" /></span>
                                  <Input size="large" disabled className="inputBorder" value={_.floor(payoutOnWin, 4)} />
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row type="flex" justify="center" align="middle" gutter={{ xs: 12, lg: 24, xxl: 36 }}>
                          <Col span={6}>
                            <div className="bet_description"><IntlMessages id="dice.balance.eos" /></div>
                            <div className="bet_value">{_.floor(eosBalance, 2)}<span className="highlight"> <IntlMessages id="dice.asset.eos" /></span></div>
                          </Col>
                          <Col span={12}>
                            {username === this.defaultUsername ? <Button className="btn-login" size="large" type="primary" onClick={this.onLogInClicked}><IntlMessages id="dice.button.login" /></Button> : <Button className="btn-login" size="large" type="primary" onClick={this.onBetClicked}><IntlMessages id="dice.button.bet" /></Button>}
                            <div className="bet_description"><Icon type="question-circle" /><IntlMessages id="dice.reward.firstbet" values={{ amount: appConfig.firstBetReward }} /></div>
                          </Col>
                          <Col span={6}>
                            <div className="bet_description"><IntlMessages id="dice.balance.betx" /></div>
                            <div className="bet_value">{_.floor(betxBalance, 2)}<span className="highlight"> <IntlMessages id="dice.asset.betx" /></span></div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </section>
              </Col>
              <Col xs={24} lg={8}>

                <section className="hideOnMobile">
                  <div className="container">
                    <div className="holderBorder">
                      <Chatroom username={username} />
                    </div>
                  </div>
                </section>
              </Col>
              <Col xs={24} lg={24}>

                <section id="tables" >
                  {/* <div className="horizontalWrapper"> */}
                  <div className="container">
                    <Tabs size="large">
                      <TabPane tab={<IntlMessages id="dice.history.all" />} key="allbet">
                        <div className="holderBorder">
                          <Table
                            columns={columns}
                            dataSource={allBetData}
                            bordered={false}
                            showHeader
                            pagination={false}
                          />
                        </div>
                      </TabPane>
                      <TabPane tab={<IntlMessages id="dice.history.my" />} key="mybet">
                        <div className="holderBorder">
                          <Table
                            columns={columns}
                            dataSource={myBetData}
                            bordered={false}
                            showHeader
                            pagination={false}
                          />
                        </div>
                      </TabPane>
                      <TabPane tab={<IntlMessages id="dice.history.huge" />} key="hugebet">
                        <div className="holderBorder">
                          <Table
                            columns={columns}
                            dataSource={hugeBetData}
                            bordered={false}
                            showHeader
                            pagination={false}
                          />
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                  {/* </div> */}
                </section>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

DicePage.propTypes = {
  locale: PropTypes.string,
  transferReq: PropTypes.func,
  initSocketConnectionReq: PropTypes.func,
  betHistory: PropTypes.object,
  refresh: PropTypes.bool,
  getIdentityReq: PropTypes.func,
  setErrorMessageReq: PropTypes.func,
  username: PropTypes.string,
  eosBalance: PropTypes.number,
  betxBalance: PropTypes.number,
  intl: intlShape.isRequired,
  successMessage: PropTypes.string,
  fetchBetHistoryReq: PropTypes.func,
  referrer: PropTypes.string.isRequired,
  view: PropTypes.string,
  currentBets: PropTypes.array,
  deleteCurrentBetReq: PropTypes.func,
  getBalancesReq: PropTypes.func,
  getAccountInfoReq: PropTypes.func,
};

DicePage.defaultProps = {
  locale: 'en',
  transferReq: undefined,
  initSocketConnectionReq: undefined,
  betHistory: undefined,
  refresh: false,
  username: undefined,
  eosBalance: undefined,
  betxBalance: undefined,
  getIdentityReq: undefined,
  setErrorMessageReq: undefined,
  successMessage: undefined,
  fetchBetHistoryReq: undefined,
  view: undefined,
  currentBets: [],
  deleteCurrentBetReq: undefined,
  getBalancesReq: undefined,
  getAccountInfoReq: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  betHistory: state.Bet.get('history'),
  refresh: state.Bet.get('refresh'),
  username: state.App.get('username'),
  eosBalance: state.App.get('eosBalance'),
  betxBalance: state.App.get('betxBalance'),
  successMessage: state.App.get('successMessage'),
  referrer: state.App.get('ref'),
  view: state.App.get('view'),
  currentBets: state.Bet.get('currentBets'),
});

const mapDispatchToProps = (dispatch) => ({
  transferReq: (obj) => dispatch(transfer(obj)),
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  getIdentityReq: () => dispatch(getIdentity()),
  setErrorMessageReq: (errorMessage) => dispatch(setErrorMessage(errorMessage)),
  fetchBetHistoryReq: () => dispatch(fetchBetHistory()),
  deleteCurrentBetReq: (transactionId) => dispatch(deleteCurrentBet(transactionId)),
  getBalancesReq: (name) => dispatch(getBalances(name)),
  getAccountInfoReq: (name) => dispatch(getAccountInfo(name)),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DicePage));
