/* eslint react/no-array-index-key: 0, no-nested-ternary: 0, react/no-unused-prop-types: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Icon, Row, Col, Table, Tabs, message, Switch, Tooltip } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import 'animate.css/animate.min.css';
import CountUp from 'react-countup';

import BetRank from './betRank';
import FairModal from '../../components/modal/fairness';
import Slider from '../../components/uielements/slider';
import Carousel from './carousel';
import BuyBack from './buyback';
import Chatroom from '../../components/chatroom';
import betActions from '../../redux/bet/actions';
import appActions from '../../redux/app/actions';
import IntlMessages from '../../components/utility/intlMessages';
import { appConfig } from '../../settings';
import { randomString, parseAsset } from '../../helpers/utility';
import CurrencyBar from './currencyBar';
import Button from '../../components/uielements/button';

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

const { initSocketConnection } = betActions;
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

function calculateCountUp(value) {
  let result = 50;

  if (value > 50) {
    result = _.random(1, value - 50, false);
  } else {
    result = _.random(value + 50, 100, false);
  }

  return result;
}

const symbols = [
  {
    symbol: 'EOS', min: 0.1, max: 1000, precision: 2, default: 1,
  },
  {
    symbol: 'BETX', min: 100, max: 100000, precision: 2, default: 100,
  },
  {
    symbol: 'EBTC', min: 0.0001, max: 10000, precision: 4, default: 0.0001,
  },
  {
    symbol: 'EETH', min: 0.001, max: 10000, precision: 4, default: 0.001,
  },
  {
    symbol: 'EUSD', min: 0.1, max: 10000, precision: 2, default: 1,
  },
];

function getDefaultBySymbol(symbol) {
  const symbolMatch = _.find(symbols, { symbol });

  if (_.isUndefined(symbolMatch)) {
    return 1;
  }

  return symbolMatch.default;
}

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

function getDisabledBySymbol(symbol) {
  const symbolMatch = _.find(symbols, { symbol });

  if (_.isUndefined(symbolMatch)) {
    return 10000;
  }

  return symbolMatch.disabled;
}

class DicePage extends React.Component {
  constructor(props) {
    super(props);

    const betAmount = 1;
    const winChance = calculateWinChance(DEFAULT_ROLL_NUMBER);
    const payout = calculatePayout(winChance);
    const payoutOnWin = calculatePayoutOnWin(betAmount, payout);
    const { intl } = this.props;

    this.defaultUsername = `Guest-${_.random(100000, 999999, false)}`;
    this.state = {
      betAmount,
      payout,
      payoutOnWin,
      winChance,
      username: this.defaultUsername,
      seed: randomString(SEED_STR_LENGTH),
      isFairnessModalVisible: false,
      autoBetEnabled: false, // True if auto-bet switch is turned on
      myBetHistoryFetched: false, // Guard to make sure myBetHistory only fetched once
      sliderValue: DEFAULT_ROLL_NUMBER,
      sliderLabel: {},
      statePendingBet: undefined,
    };

    const that = this;
    this.desktopColumns = [{
      title: intl.formatMessage({ id: 'dice.history.form.time' }),
      dataIndex: 'time',
      key: 'time',
    }, {
      title: intl.formatMessage({ id: 'dice.history.form.bettor' }),
      dataIndex: 'bettor',
      key: 'bettor',
      render: (text, record) => {
        if (record.bettor === that.state.username) {
          return (<span className="table-td-highlight">{record.bettor}</span>);
        }
        return record.bettor;
      },
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
        <span>{text}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dice.history.form.payout' }),
      dataIndex: 'payout',
      key: 'payout',
      render: (text) => text ? <span className="table-td-highlight">{text}</span> : '',
    },
    {
      title: '',
      dataIndex: 'trxUrl',
      key: 'trxUrl',
      render: (text) => (
        <a href={text} target="_blank" className="table-td-angle-right" ><Icon type="right" /></a>
      ),
    },
    ];

    // Only display five columns on Mobile View
    this.mobileColumns = _.filter(this.desktopColumns, (row) => (
      row.key === 'bettor' ||
      row.key === 'rollUnder' ||
      row.key === 'betAmount' ||
      row.key === 'roll' ||
      row.key === 'payout'
    ));

    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.onBetAmountButtonClick = this.onBetAmountButtonClick.bind(this);
    this.onBetClicked = this.onBetClicked.bind(this);
    this.onLogInClicked = this.onLogInClicked.bind(this);
    this.formatBetAmountStr = this.formatBetAmountStr.bind(this);
    this.setFairnessModalVisibility = this.setFairnessModalVisibility.bind(this);
    this.onAutoBetSwitchChange = this.onAutoBetSwitchChange.bind(this);
    this.resetSeed = this.resetSeed.bind(this);
    this.getBalanceBySymbol = this.getBalanceBySymbol.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onCountEnd = this.onCountEnd.bind(this);
  }

  componentWillMount() {
    const {
      getPageData,
    } = this.props;

    getPageData('dice');
  }

  componentDidMount() {
    const {
      initSocketConnectionReq, fetchBetHistory, fetchHugeBetHistory, selectedSymbol,
    } = this.props;
    initSocketConnectionReq({ collection: 'Bet' });
    fetchBetHistory();
    fetchHugeBetHistory({ symbol: selectedSymbol, limit: appConfig.hugeBetAmount });
  }

  componentWillReceiveProps(nextProps) {
    const {
      username, selectedSymbol: newSelectedSymbol, errorMessage, pendingBet,
    } = nextProps;

    const {
      intl, getBalancesReq, getAccountInfoReq, selectedSymbol, fetchMyBetHistory, resetPendingBet,
    } = this.props;
    const {
      username: stateUsername,
      payout,
      myBetHistoryFetched,
      statePendingBet,
    } = this.state;
    let { autoBetEnabled } = this.state;
    const { onBetClicked } = this;

    const fieldsToUpdate = {};

    // Update username in state if we received one from props; this means login succeeded
    fieldsToUpdate.username = username || this.defaultUsername;

    if (username && username !== this.defaultUsername && !myBetHistoryFetched) {
      fetchMyBetHistory({ username });

      fieldsToUpdate.myBetHistoryFetched = true;
    }

    // Turn off autobet when switching symbol and change betAmount to default
    if (newSelectedSymbol !== selectedSymbol) {
      if (autoBetEnabled) {
        autoBetEnabled = false;
        fieldsToUpdate.autoBetEnabled = autoBetEnabled;
        message.warning(intl.formatMessage({
          id: 'message.warn.autoBetTurnedOff',
        }));
      }

      // If current betAmount is less than default amount; set it to default amount when switching symbols
      const defaultAmount = getDefaultBySymbol(newSelectedSymbol);
      fieldsToUpdate.betAmount = defaultAmount;
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


    // Update UI if pendingBet has changed
    if (!_.isEqual(statePendingBet, pendingBet)) {
      // console.log(`pendingBet has changed ${JSON.stringify(statePendingBet)} -> ${JSON.stringify(pendingBet)}`);

      // pendingBet will have below values
      // 1. undefined. pendingBet reset case; we will reset state pendingBet
      // 2. status undefined. Transfer just sent and pendingBet just created case
      // 3. status defined. Roll result has come back
      if (_.isUndefined(statePendingBet) && !_.isUndefined(pendingBet) && _.isFunction(this.startCountUp)) { // Just sent transfer case
        this.startCountUp();
      } else if (!_.isUndefined(statePendingBet) && _.isUndefined(pendingBet) && _.isFunction(this.resetCountUp)) { // Reset case
        this.resetCountUp();
      } else if (pendingBet && pendingBet.status && pendingBet.status !== 'Created') { // This is result returned condition
        if (!pendingBet.isResolved) {
          console.error('Pending bet has changed but not resolved ...');
        }

        fieldsToUpdate.sliderLabel = {};
        fieldsToUpdate.sliderLabel[pendingBet.roll] = pendingBet.roll;

        resetPendingBet();

        setTimeout(() => {
          getBalancesReq(username);
        }, 1000);

        if (autoBetEnabled) {
          setTimeout(() => {
            onBetClicked();
          }, 1000);
        }
      }
      fieldsToUpdate.statePendingBet = _.cloneDeep(pendingBet);
    }

    this.setState(fieldsToUpdate);
  }

  componentWillUnmount() {
    const { closeSocketConnection } = this.props;

    closeSocketConnection();
  }

  onCountEnd() {
    const { statePendingBet } = this.state;

    // Stop change countUp text if statePendingBet is undefined
    if (_.isUndefined(statePendingBet)) {
      return;
    }

    const currentValue = _.toNumber(this.countUpRef.current.innerText);

    const newEndNum = calculateCountUp(currentValue);
    this.updateCountUp(newEndNum);
  }

  onSliderChange(value) {
    const { betAmount } = this.state;

    const winChance = calculateWinChance(value);
    const payout = calculatePayout(winChance);
    const payoutOnWin = calculatePayoutOnWin(betAmount, payout);

    this.setState({
      sliderValue: value,
      winChance,
      payout,
      payoutOnWin,
    });
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
      sliderValue, username, seed,
    } = this.state;

    let { betAmount } = this.state;

    const {
      transferReq, setErrorMessageReq, referrer, selectedSymbol, pendingBet,
    } = this.props;

    // User not logged in case
    if (username === this.defaultUsername) {
      setErrorMessageReq('error.page.usernamenotfound');
      return;
    }

    // A Bet is pending case
    if (!_.isUndefined(pendingBet)) {
      return;
    }

    const minAmount = getMinBySymbol(selectedSymbol);

    if (betAmount < minAmount) {
      betAmount = minAmount;
      this.setState({
        betAmount,
      });
    }

    // Remove slider label
    this.setState({
      sliderLabel: {},
    });

    transferReq({
      bettor: username,
      betAmount,
      betAsset: selectedSymbol,
      rollUnder: sliderValue,
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
      }, { amount: minAmount, asset: selectedSymbol }));

      return lowBound;
    } else if (_.toNumber(betAmountStr) > highBound) {
      message.warning(intl.formatMessage({
        id: 'message.warn.greaterThanMaxBet',
      }, { amount: maxAmount, asset: selectedSymbol }));
      return highBound;
    }

    const parts = betAmountStr.split('.');

    if (parts.length <= 1) {
      return betAmountStr;
    }
    return `${parts[0]}.${parts[1].substring(0, MAX_FLOAT_DIGITS)}`;
  }

  setFairnessModalVisibility(value) {
    this.setState({
      isFairnessModalVisible: value,
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
      betAmount, payoutOnWin, winChance, payout, username, seed, sliderValue, sliderLabel, isFairnessModalVisible, statePendingBet, autoBetEnabled,
    } = this.state;

    const {
      betHistory, myBetHistory, hugeBetHistory, view, intl, selectedSymbol, pageData,
    } = this.props;

    const columns = view === 'MobileView' ? mobileColumns : desktopColumns;

    const screenWidth = document.body.clientWidth; // If the screenWidth<1024, the autoBet tooltip will be actived by click;

    const autoBetElement = (<div className="auto-bet">
      <IntlMessages id="dice.play.autoBet" />
      <Switch
        disabled={username === this.defaultUsername}
        checked={autoBetEnabled}
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
    const that = this;
    const countUpStart = statePendingBet && (statePendingBet.isResolved ? statePendingBet.roll : statePendingBet.rollUnder);

    const countUp = (<CountUp
      start={countUpStart}
      end={calculateCountUp(countUpStart)}
      duration={3}
      decimals={0}
      useEasing={false}
      onEnd={this.onCountEnd}
    >
      {({
        countUpRef, start, reset, update,
      }) => {
        that.startCountUp = start;
        that.updateCountUp = update;
        that.resetCountUp = reset;
        that.countUpRef = countUpRef;
        return (
          <span ref={countUpRef} />
        );
      }
      }
    </CountUp>);

    let rollBtn;
    const rollBtnTextDisplay = statePendingBet ? 'none' : 'inline-block';
    const rollBtnNumDisplay = statePendingBet ? 'inline-block' : 'none';

    if (getDisabledBySymbol(currentSymbol)) {
      rollBtn = ( // Roll Button disabled case
        <Button className="btn-login" width={view === 'MobileView' ? 120 : 200} height={view === 'MobileView' ? 48 : 64} onClick={this.onBetClicked} disabled>
          {view === 'MobileView' ? <IntlMessages id="dice.button.bet" /> : <IntlMessages id="dice.alert.comingsoon" />}
        </Button>);
    } else { // Enabled case
      rollBtn = (<Button className="btn-login" width={view === 'MobileView' ? 120 : 200} height={view === 'MobileView' ? 48 : 64} onClick={this.onBetClicked}>
        <div style={{ display: rollBtnNumDisplay }}>{countUp}</div>
        <span style={{ display: rollBtnTextDisplay }}>{intl.formatMessage({ id: 'dice.button.bet' })}</span>
      </Button>);
    }

    return (
      <div id="dicepage">
        <div className="dicepage-top">
          <div className="horizontalWrapper ">
            <Row gutter={40} style={{ marginTop: '12px', marginBottom: '12px' }}>
              <Col xs={24} lg={6}>
              </Col>
              <Col xs={24} lg={8}>
                <Carousel className="hideOnLarge" />
              </Col>
              <Col xs={24} lg={10}>
                <div>
                  <a href={null} onClick={() => this.setFairnessModalVisibility(true)} className="fair-btn"><IntlMessages id="dice.play.fairBtn" /></a>
                </div>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col xs={24} lg={6}>
                <div id="ann" className="box-container">
                  <BuyBack />
                </div>
              </Col>
              <Col
                xs={24}
                lg={12}
                style={{
                  display: 'flex',
                  flexDirection: view === 'DesktopView' ? 'row' : 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <CurrencyBar direction={view === 'DesktopView' ? 'column' : 'row'} />
                <div className="box-container dice-container" >
                  <div className="container-body">
                    <Row gutter={24}>
                      <Col xs={24} lg={12} >
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="dice.play.amount" /></div>
                          <div className="box-middle">
                            <input className="box-input" onBlur={() => window.scroll(0, 0)} onChange={this.onInputNumberChange} value={betAmount} />
                            <span className="box-input-inner-addOn">{selectedSymbol}</span>
                          </div>
                          <div className="box-bottom">
                            <span className="box-bottom-btn" onClick={this.onBetAmountButtonClick} data-value="0.5" >1/2</span>
                            <span className="box-bottom-btn" onClick={this.onBetAmountButtonClick} data-value="2" >2X</span>
                            <span className="box-bottom-btn" onClick={this.onBetAmountButtonClick} data-value={MAX_BALANCE_STR} >{MAX_BALANCE_STR}</span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} lg={12} >
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="dice.reward.total" /></div>
                          <div className="box-middle">
                            <span className="box-input">{_.floor(payoutOnWin, 3)}</span>
                            <span className="box-input-inner-addOn">{selectedSymbol}</span>
                          </div>
                          <div className="box-bottom box-bottom-span">
                            <IntlMessages id="dice.reward.maxbet" values={{ amount: getMaxBySymbol(currentSymbol), symbol: currentSymbol }} />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="container-body-numbers" type="flex">
                      <Col span={8}>
                        <div className="box">
                          <div className="label"><IntlMessages id="dice.play.rollUnder" /></div>
                          <div className="value">{sliderValue}↓</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="box">
                          <div className="label"><IntlMessages id="dice.play.payout" /></div>
                          <div className="value">{_.floor(payout, 3)}X</div>
                        </div>

                      </Col>
                      <Col span={8}>
                        <div className="box">
                          <div className="label"><IntlMessages id="dice.play.win" /></div>
                          <div className="value">{(_.floor(winChance, 3) * 100).toFixed(2)}%</div>
                        </div>
                      </Col>
                    </Row>
                    <div className="container-body-input-slider">
                      <Slider
                        min={MIN_ROLL_NUMBER}
                        max={MAX_ROLL_NUMBER}
                        start={MIN_SELECT_ROLL_NUMBER}
                        end={MAX_SELECT_ROLL_NUMBER}
                        value={sliderValue}
                        labels={sliderLabel}
                        onChange={this.onSliderChange}
                      />
                    </div>

                    <Row className="container-body-btn" type="flex" justify="center" align="middle" >
                      <Col span={6}>
                        {this.getBalanceBySymbol(currentSymbol) ? <div className="container-body-btn-balance">{this.getBalanceBySymbol(currentSymbol)}<span className="highlight"> {currentSymbol}</span></div> : null}
                      </Col>
                      <Col span={12}>
                        {autoBetElement}
                        {username === this.defaultUsername
                          ? <Button className="btn-login" width={view === 'MobileView' ? 120 : 200} height={view === 'MobileView' ? 48 : 64} onClick={this.onLogInClicked}><IntlMessages id="dice.button.login" /></Button>
                          : rollBtn}
                      </Col>
                      <Col span={6}>
                        {this.getBalanceBySymbol('BETX') ? <div className="container-body-btn-balance">{this.getBalanceBySymbol('BETX')}<span className="highlight"> <IntlMessages id="dice.asset.betx" /></span></div> : null}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className="box-container hideOnMobile">
                  <Chatroom username={username} />
                </div>
              </Col>
              <Col xs={24} lg={24}>
                <BetRank data={pageData && pageData.rankHistory} />
              </Col>
            </Row>
          </div>
        </div>

        <div className="dicepage-bottom">
          <div className="horizontalWrapper">
            <Row>
              <Col xs={24} lg={24}>
                <section id="tables" >
                  <div className="container">
                    <Tabs size="large" animated={false}>
                      <TabPane tab={<IntlMessages id="dice.history.all" />} key="allbet">
                        <div className="box-container">
                          <Table
                            columns={columns}
                            dataSource={betHistory}
                            bordered={false}
                            showHeader
                            pagination={false}
                          />
                        </div>
                      </TabPane>
                      <TabPane tab={<IntlMessages id="dice.history.my" />} key="mybet">
                        <div className="box-container">
                          <Table
                            columns={columns}
                            dataSource={myBetHistory}
                            bordered={false}
                            showHeader
                            pagination={false}
                          />
                        </div>
                      </TabPane>
                      <TabPane tab={<IntlMessages id="dice.history.huge" />} key="hugebet">
                        <div className="box-container">
                          <Table
                            columns={columns}
                            dataSource={hugeBetHistory}
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
              isVisible={isFairnessModalVisible}
              seed={seed}
              onReset={this.resetSeed}
              onOk={() => this.setFairnessModalVisibility(false)}
              onClose={() => this.setFairnessModalVisibility(false)}
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
  betHistory: PropTypes.array,
  myBetHistory: PropTypes.array,
  hugeBetHistory: PropTypes.array,
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
  getBalancesReq: PropTypes.func,
  getAccountInfoReq: PropTypes.func,
  selectedSymbol: PropTypes.string,
  pageData: PropTypes.object,
  getPageData: PropTypes.func,
  errorMessage: PropTypes.string,
  pendingBet: PropTypes.object,
  resetPendingBet: PropTypes.func,
  closeSocketConnection: PropTypes.func,
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
  getBalancesReq: undefined,
  getAccountInfoReq: undefined,
  selectedSymbol: undefined,
  pageData: undefined,
  getPageData: undefined,
  errorMessage: undefined,
  pendingBet: undefined,
  resetPendingBet: undefined,
  closeSocketConnection: undefined,
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
  selectedSymbol: state.Bet.get('selectedSymbol'),
  pageData: state.App.get('dicePageData'),
  errorMessage: state.App.get('errorMessage'),
  pendingBet: state.Bet.get('pendingBet'),
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
  getBalancesReq: (name) => dispatch(getBalances(name)),
  getAccountInfoReq: (name) => dispatch(getAccountInfo(name)),
  resetPendingBet: () => dispatch(betActions.resetPendingBet()),
  closeSocketConnection: () => dispatch(betActions.closeSocketConnection()),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DicePage));
