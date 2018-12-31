/* eslint react/no-array-index-key: 0, no-nested-ternary: 0, react/no-unused-prop-types: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';
import { Icon, Row, Col, Table, Input, Button, Tabs, message, Switch, Tooltip } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'animate.css/animate.min.css';

import ReactNotification from '../components/react-notification-component';
import BetRank from '../components/betRank';
import FairModal from '../components/fairModal';
import '../components/react-notification-component/less/notification.less';
// import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';

import Slider from '../components/slider';
import Dice from '../components/dice';
import Chatroom from '../components/chatroom';
import betActions from '../redux/bet/actions';
import appActions from '../redux/app/actions';
import IntlMessages from '../components/utility/intlMessages';
import { appConfig } from '../settings';
import { randomString } from '../helpers/utility';
import CurrencyBar from '../components/currencyBar';

// cloudinaryConfig({ cloud_name: 'forgelab-io' });

const { TabPane } = Tabs;
const MAX_BALANCE_STR = 'MAX';
const MIN_ROLL_NUMBER = 1;
const MIN_SELECT_ROLL_NUMBER = 2;
const MAX_ROLL_NUMBER = 100;
const MAX_SELECT_ROLL_NUMBER = 96;
const DEFAULT_ROLL_NUMBER = 50;
const DIVIDEND = 0.98;

const MAX_FLOAT_DIGITS = 4;
const SEED_STR_LENGTH = 21;

const MAX_CONCURRENT_AUTOBET = 2;

const { initSocketConnection, deleteCurrentBet } = betActions;
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

const symbols = [
  {
    symbol: 'EOS', min: 0.1, max: 10000, precision: 2,
  },
  {
    symbol: 'BETX', min: 10, max: 10000, precision: 2,
  },
  {
    symbol: 'EBTC', min: 0.0001, max: 10000, precision: 4,
  },
  {
    symbol: 'EETH', min: 0.001, max: 10000, precision: 4,
  },
  {
    symbol: 'EUSD', min: 0.1, max: 10000, precision: 2,
  },
];

function getMinBySymbol(symbol) {
  const symbolMatch = _.find(symbols, { symbol });

  if (_.isUndefined(symbolMatch)) {
    return 1;
  }

  return symbolMatch.min;
}

function getMaxBySymbol(symbol) {
  const symbolMatch = _.find(symbols, { symbol });

  if (_.isUndefined(symbolMatch)) {
    return 10000;
  }

  return symbolMatch.max;
}

function prepareTableData(historyQueue, momentLocale) {
  const tableData = historyQueue.all();

  const rawBetData = _.isEmpty(tableData) ? [] : _.reverse(_.map(tableData, (bet) => ({
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

  return rawBetData;
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
      username: this.defaultUsername,
      seed: randomString(SEED_STR_LENGTH),
      notifications: [],
      fairModalShow: false,
      autoBetEnabled: false, // True if auto-bet switch is turned on
      lastBetNotificationId: undefined, // Guard start of the next auto-bet so we don't start twice
      myBetHistoryFetched: false, // Guard to make sure myBetHistory only fetched once
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
      title: intl.formatMessage({ id: 'dice.history.form.under' }),
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
      title: intl.formatMessage({ id: 'dice.history.form.bettor' }),
      dataIndex: 'bettor',
      key: 'bettor',
      render: (text) => (
        <span className="player-td">{text}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.under' }),
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
    ];

    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.onBetAmountButtonClick = this.onBetAmountButtonClick.bind(this);
    this.getSliderValue = this.getSliderValue.bind(this);
    this.onBetClicked = this.onBetClicked.bind(this);
    this.onLogInClicked = this.onLogInClicked.bind(this);
    this.formatBetAmountStr = this.formatBetAmountStr.bind(this);
    this.toggleFairModal = this.toggleFairModal.bind(this);
    this.notificationDOMRef = React.createRef();
    this.onAutoBetSwitchChange = this.onAutoBetSwitchChange.bind(this);
    this.resetSeed = this.resetSeed.bind(this);
    this.getBalanceBySymbol = this.getBalanceBySymbol.bind(this);
  }

  componentWillMount() {
    const {
      fetchBetHistory, fetchHugeBetHistory, selectedSymbol, getPageData,
    } = this.props;

    fetchBetHistory();
    fetchHugeBetHistory({ symbol: selectedSymbol, limit: appConfig.hugeBetAmount });
    getPageData('dice');
  }

  componentDidMount() {
    const { initSocketConnectionReq } = this.props;
    initSocketConnectionReq({ collection: 'Bet' });
  }

  componentWillReceiveProps(nextProps) {
    const {
      username, selectedSymbol: newSelectedSymbol, currentBets, errorMessage,
    } = nextProps;

    const {
      intl, deleteCurrentBetReq, getBalancesReq, getAccountInfoReq, selectedSymbol, fetchMyBetHistory,
    } = this.props;
    const {
      notifications,
      username: stateUsername,
      lastBetNotificationId,
      payout,
      myBetHistoryFetched,
    } = this.state;
    let { autoBetEnabled } = this.state;
    const { notificationDOMRef, onBetClicked } = this;

    const fieldsToUpdate = {};

    // Update username in state if we received one from props; this means Scatter login succeeded
    fieldsToUpdate.username = username || this.defaultUsername;

    if (username && username !== this.defaultUsername && !myBetHistoryFetched) {
      fetchMyBetHistory({ username });

      fieldsToUpdate.myBetHistoryFetched = true;
    }

    // Turn off autobet when switching symbol and change betAmount to min
    if (newSelectedSymbol !== selectedSymbol) {
      if (autoBetEnabled) {
        autoBetEnabled = false;
        fieldsToUpdate.autoBetEnabled = autoBetEnabled;
        message.warning(intl.formatMessage({
          id: 'message.warn.autoBetTurnedOff',
        }));
      }

      fieldsToUpdate.betAmount = getMinBySymbol(newSelectedSymbol);
      const payoutOnWin = calculatePayoutOnWin(fieldsToUpdate.betAmount, payout);
      fieldsToUpdate.payoutOnWin = payoutOnWin;
    }

    if (errorMessage) {
      if (autoBetEnabled) {
        autoBetEnabled = false;
        fieldsToUpdate.autoBetEnabled = autoBetEnabled;
        message.warning(intl.formatMessage({
          id: 'message.warn.autoBetTurnedOff',
        }));
      }
    }

    // Add or remove notification box based currentBets update
    _.each(currentBets, (bet) => {
      const existingNotification = _.find(notifications, { transactionId: bet.transactionId });

      const titleEle = <p className="notification-title">{intl.formatMessage({ id: 'message.success.sentBet' }, { betAmount: bet.betAmount })}</p>;

      console.log('bet.isResolved', bet.isResolved);

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

        console.log('notifications.length', notifications.length);
        // Send the next bet is autobet is enabled; lastBetNotificationId is here to prevent we enter this code twice
        if (autoBetEnabled && lastBetNotificationId !== notificationId && notifications.length < MAX_CONCURRENT_AUTOBET) {
          this.setState({
            lastBetNotificationId: notificationId,
          });
          setTimeout(() => {
            onBetClicked();
          }, 1500);
        }

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
        }, 3000);
      }
    });

    fieldsToUpdate.notifications = notifications;

    this.setState(fieldsToUpdate);
  }

  onInputNumberChange(evt) {
    const { payout } = this.state;

    const { value } = evt.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

    if (value === '' || value[value.length - 1] === '.') {
      this.setState({
        betAmount: value,
      });

      return;
    }

    if ((!_.isNaN(value) && reg.test(value))) {
      const betAmount = value;
      const payoutOnWin = calculatePayoutOnWin(betAmount, payout);

      this.setState({
        betAmount,
        payoutOnWin,
      });
    }
  }

  onBetAmountButtonClick(e) {
    const {
      betAmount, payout, username,
    } = this.state;
    const { formatBetAmountStr, getBalanceBySymbol } = this;
    const { selectedSymbol } = this.props;

    const balance = getBalanceBySymbol(selectedSymbol);

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
      rollNumber, username, seed,
    } = this.state;

    let { betAmount } = this.state;

    const {
      transferReq, setErrorMessageReq, referrer, selectedSymbol,
    } = this.props;

    if (username === this.defaultUsername) {
      setErrorMessageReq('error.page.usernamenotfound');
      return;
    }

    const minAmount = getMinBySymbol(selectedSymbol);

    if (betAmount < minAmount) {
      betAmount = minAmount;
      this.setState({
        betAmount,
      });
    }

    transferReq({
      bettor: username,
      betAmount,
      betAsset: selectedSymbol,
      rollUnder: rollNumber,
      referrer,
      seed, // We haven't set up a function for user custom seed
    });
  }

  getBalanceBySymbol(symbol) {
    const {
      eosBalance, betxBalance, ebtcBalance, eethBalance, eusdBalance,
    } = this.props;

    const match = _.find(symbols, { symbol });
    const precision = _.isUndefined(match) ? 4 : match.precision;

    switch (symbol) {
      case 'EOS':
        return _.floor(eosBalance, precision);
      case 'BETX':
        return _.floor(betxBalance, precision);
      case 'EBTC':
        return _.floor(ebtcBalance, precision);
      case 'EETH':
        return _.floor(eethBalance, precision);
      case 'EUSD':
        return _.floor(eusdBalance, precision);
      default:
        return 0;
    }
  }

  /**
 * Restrict bet amount to be in certain range
 * @return {[type]} [description]
 */
  formatBetAmountStr(betAmountStr) {
    const { intl, selectedSymbol } = this.props;

    const minAmount = getMinBySymbol(selectedSymbol);
    const maxAmount = getMaxBySymbol(selectedSymbol);

    const lowBound = minAmount;
    const highBound = maxAmount;
    _.clamp(_.toNumber(betAmountStr), lowBound, highBound);

    if (_.toNumber(betAmountStr) < lowBound) {
      message.warning(intl.formatMessage({
        id: 'message.warn.lessThanMinBet',
      }, {
        amount: minAmount,
        asset: selectedSymbol,
      }));

      return lowBound;
    } else if (_.toNumber(betAmountStr) > highBound) {
      message.warning(intl.formatMessage({
        id: 'message.warn.greaterThanMaxBet',
      }, {
        amount: maxAmount,
        asset: selectedSymbol,
      }));
      return highBound;
    }

    const parts = betAmountStr.split('.');

    if (parts.length <= 1) {
      return betAmountStr;
    }
    return `${parts[0]}.${parts[1].substring(0, MAX_FLOAT_DIGITS)}`;
  }

  toggleFairModal(visible) {
    this.setState({
      fairModalShow: visible,
    });
  }

  onAutoBetSwitchChange(checked) {
    // Kick off a bet if there's no ongoing bet
    if (checked) {
      this.onBetClicked();
    }

    // Set state value autoBetEnabled
    this.setState({
      autoBetEnabled: checked,
    });
  }

  resetSeed() {
    this.setState({
      seed: randomString(SEED_STR_LENGTH),
    });
  }

  render() {
    const { desktopColumns, mobileColumns } = this;
    const {
      betAmount, payoutOnWin, winChance, payout, rollNumber, username, seed,
    } = this.state;

    const {
      betHistory, myBetHistory, hugeBetHistory, locale, view, intl, selectedSymbol, pageData,
    } = this.props;

    const momentLocale = (locale === 'en') ? 'en' : 'zh-cn';

    // Prepare data for three tables at bottom
    const allBetData = prepareTableData(betHistory, momentLocale);
    const myBetData = prepareTableData(myBetHistory, momentLocale);
    const hugeBetData = prepareTableData(hugeBetHistory, momentLocale);

    const columns = view === 'MobileView' ? mobileColumns : desktopColumns;

    const screenWidth = document.body.clientWidth; // If the screenWidth<1024, the autoBet tooltip will be actived by click;

    const autoBetElement = (<div className="auto-bet">
      <IntlMessages id="dice.play.autoBet" />
      <Switch
        disabled={username === this.defaultUsername}
        checkedChildren={intl.formatMessage({ id: 'dice.play.autoBet.switch.on' })}
        unCheckedChildren={intl.formatMessage({ id: 'dice.play.autoBet.switch.off' })}
        onChange={this.onAutoBetSwitchChange}
        size="default"
      />
      <Tooltip title={(<IntlMessages id="dice.play.autoTool" />)} trigger={screenWidth <= 1024 ? 'click' : 'hover'}>
        <Icon type="question-circle" className="auto-bet-icon" />
      </Tooltip>
    </div>);

    const currentSymbol = (selectedSymbol === 'BETX') ? 'EOS' : selectedSymbol;

    return (
      <div>
        <div id="dicepage">
          <div className="horizontalWrapper">
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <section>
                  <CurrencyBar />
                  <div className="container">
                    <ReactNotification ref={this.notificationDOMRef} />
                    <div className="holderBorder">
                      <div className="container-header">
                        <Row>
                          <Col span={24}>
                            <div className="currency-switch">
                              <Button onClick={() => this.toggleFairModal(true)} className="fair-btn" icon="trophy"><IntlMessages id="dice.play.fairBtn" /></Button>
                            </div>
                          </Col>

                        </Row>
                      </div>
                      <div className="container-body">

                        <Row className="container-body-numbers" type="flex">
                          <Col span={8}>
                            <div className="box box-label">
                              <div className="box-inner">
                                <div className="label">{view === 'DesktopView' ? <IntlMessages id="dice.play.rollUnderToWin" /> : <IntlMessages id="dice.play.rollUnder" />}
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
                        <Row className="container-body-input" type="flex" justify="center" align="middle">
                          <Col xs={24} lg={20}>
                            <div className="container-body-input-slider">
                              <Slider getValue={this.getSliderValue} defaultValue={DEFAULT_ROLL_NUMBER} min={MIN_SELECT_ROLL_NUMBER} max={MAX_SELECT_ROLL_NUMBER} step={1} />
                            </div>
                          </Col>
                          <Col xs={{ span: 14, order: 2 }} lg={{ span: 8, order: 1 }} >

                            <div className="box box-input">
                              <div className="box-inner">
                                <Row type="flex" justify="center" align="middle">
                                  <Col xs={18} lg={16}>
                                    <div className="box-input-inner">
                                      <span className="label"><IntlMessages id="dice.play.amount" /></span>
                                      <Input className="box-input-inner-input inputBorder" size="large" onBlur={() => window.scroll(0, 0)} onChange={this.onInputNumberChange} value={betAmount} />
                                      <span className="box-input-inner-addOn">{selectedSymbol}</span>
                                    </div>
                                  </Col>
                                  <Col xs={6} lg={8}>
                                    <Button type="default" className="box-input-round-btn" shape="circle" icon="plus" size={view === 'DesktopView' ? 'default' : 'small'} onClick={this.onBetAmountButtonClick} data-value="1" />
                                    <Button type="default" className="box-input-round-btn" shape="circle" icon="minus" size={view === 'DesktopView' ? 'default' : 'small'} onClick={this.onBetAmountButtonClick} data-value="-1" />
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
                          <Col xs={{ span: 10, order: 3 }} lg={{ span: 8, order: 3 }} >
                            <div className="box box-input">
                              <div className="box-inner">
                                <div className="box-input-inner box-input-inner-reward">
                                  <span className="label"><IntlMessages id="dice.reward.total" /></span>
                                  <Input className="box-input-inner-input inputBorder" size="large" disabled value={_.floor(payoutOnWin, 4)} />
                                  <span className="box-input-inner-addOn">{selectedSymbol}</span>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row className="container-body-btn" type="flex" justify="center" align="middle" >
                          {/* <Col span={24}>{autoBetElement}</Col> */}
                          <Col span={6}>
                            <div className="container-body-btn-description"><IntlMessages id="dice.balance" values={{ symbol: currentSymbol }} /></div>
                            <div className="bet_value">{this.getBalanceBySymbol(currentSymbol)}<span className="highlight"> { currentSymbol }</span></div>
                          </Col>
                          <Col span={12}>
                            {autoBetElement}
                            {username === this.defaultUsername
                              ? <Button className="btn-login" size="large" type="primary" onClick={this.onLogInClicked}><IntlMessages id="dice.button.login" /></Button>
                              : <Button className="btn-login" size="large" type="primary" onClick={this.onBetClicked}><IntlMessages id="dice.button.bet" /></Button>}
                          </Col>
                          <Col span={6}>
                            <div className="container-body-btn-description"><IntlMessages id="dice.balance" values={{ symbol: 'BETX' }} /></div>
                            <div className="bet_value">{this.getBalanceBySymbol('BETX')}<span className="highlight"> <IntlMessages id="dice.asset.betx" /></span></div>
                          </Col>
                          {/*                          <Col xs={20} lg={16}>
                            <div className="container-body-btn-description container-body-btn-description-firstbet">
                              <Tooltip title={(<IntlMessages id="dice.reward.firstbet.tooltip" />)} trigger={screenWidth <= 1024 ? 'click' : 'hover'}>
                                <Icon type="question-circle" />
                              </Tooltip>
                              <IntlMessages id="dice.reward.firstbet" values={{ amount: appConfig.firstBetReward }} />
                            </div>
                          </Col> */}
                        </Row>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </section>
              </Col>
              <Col xs={24} lg={8}>

                <section className="hideOnMobile">
                  <div style={{ height: '60px' }} />
                  <div className="container">
                    <div className="holderBorder">
                      <Chatroom username={username} />
                    </div>
                  </div>
                </section>
              </Col>
              <Col xs={24} lg={24}>
                <BetRank data={pageData && pageData.rankHistory} />
              </Col>
              <Col xs={24} lg={24}>

                <section id="tables" >
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
            <FairModal
              value={seed}
              isVisible={this.state.fairModalShow}
              onReset={this.resetSeed}
              closeModal={this.toggleFairModal}
            />
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
  myBetHistory: PropTypes.object,
  hugeBetHistory: PropTypes.object,
  refresh: PropTypes.bool,
  getIdentityReq: PropTypes.func,
  setErrorMessageReq: PropTypes.func,
  username: PropTypes.string,
  eosBalance: PropTypes.number,
  betxBalance: PropTypes.number,
  ebtcBalance: PropTypes.number,
  eethBalance: PropTypes.number,
  eusdBalance: PropTypes.number,

  intl: intlShape.isRequired,
  successMessage: PropTypes.string,
  fetchBetHistory: PropTypes.func,
  fetchMyBetHistory: PropTypes.func,
  fetchHugeBetHistory: PropTypes.func,
  referrer: PropTypes.string.isRequired,
  view: PropTypes.string,
  currentBets: PropTypes.array,
  deleteCurrentBetReq: PropTypes.func,
  getBalancesReq: PropTypes.func,
  getAccountInfoReq: PropTypes.func,
  selectedSymbol: PropTypes.string,
  pageData: PropTypes.object,
  getPageData: PropTypes.func,
  errorMessage: PropTypes.string,
};

DicePage.defaultProps = {
  locale: 'en',
  transferReq: undefined,
  initSocketConnectionReq: undefined,
  betHistory: undefined,
  myBetHistory: undefined,
  hugeBetHistory: undefined,
  refresh: false,
  username: undefined,
  eosBalance: undefined,
  betxBalance: undefined,
  ebtcBalance: undefined,
  eethBalance: undefined,
  eusdBalance: undefined,
  getIdentityReq: undefined,
  setErrorMessageReq: undefined,
  successMessage: undefined,
  fetchBetHistory: undefined,
  fetchMyBetHistory: undefined,
  fetchHugeBetHistory: undefined,
  view: undefined,
  currentBets: [],
  deleteCurrentBetReq: undefined,
  getBalancesReq: undefined,
  getAccountInfoReq: undefined,
  selectedSymbol: undefined,
  pageData: undefined,
  getPageData: undefined,
  errorMessage: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  betHistory: state.Bet.get('history'),
  myBetHistory: state.Bet.get('myHistory'),
  hugeBetHistory: state.Bet.get('hugeHistory'),
  refresh: state.Bet.get('refresh'),
  username: state.App.get('username'),
  eosBalance: state.App.get('eosBalance'),
  betxBalance: state.App.get('betxBalance'),
  ebtcBalance: state.App.get('ebtcBalance'),
  eethBalance: state.App.get('eethBalance'),
  eusdBalance: state.App.get('eusdBalance'),
  successMessage: state.App.get('successMessage'),
  referrer: state.App.get('ref'),
  view: state.App.get('view'),
  currentBets: state.Bet.get('currentBets'),
  selectedSymbol: state.Bet.get('selectedSymbol'),
  pageData: state.App.get('dicePageData'),
  errorMessage: state.App.get('errorMessage'),
});

const mapDispatchToProps = (dispatch) => ({
  getPageData: (pageName) => dispatch(appActions.getPageData(pageName)),
  transferReq: (obj) => dispatch(transfer(obj)),
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  getIdentityReq: () => dispatch(getIdentity()),
  setErrorMessageReq: (errorMessage) => dispatch(setErrorMessage(errorMessage)),
  fetchBetHistory: () => dispatch(betActions.fetchBetHistory()),
  fetchMyBetHistory: (params) => dispatch(betActions.fetchMyBetHistory(params)),
  fetchHugeBetHistory: (params) => dispatch(betActions.fetchHugeBetHistory(params)),
  deleteCurrentBetReq: (transactionId) => dispatch(deleteCurrentBet(transactionId)),
  getBalancesReq: (name) => dispatch(getBalances(name)),
  getAccountInfoReq: (name) => dispatch(getAccountInfo(name)),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DicePage));
