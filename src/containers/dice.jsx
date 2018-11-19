/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Icon, Form, Row, Col, Table, Input, Button, Tabs, Popover, message } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Scroll from 'react-scroll';
import moment from 'moment';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import { injectIntl, intlShape } from 'react-intl';

import InfoSection from '../components/sections/info';
import Slider from '../components/slider';
import Chatroom from '../components/chatroom';
import betActions from '../redux/bet/actions';
import appActions from '../redux/app/actions';
import IntlMessages from '../components/utility/intlMessages';
import { appConfig } from '../settings';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { TabPane } = Tabs;
const MAX_BALANCE_STR = 'MAX';
const MIN_ROLL_NUMBER = 1;
const MIN_SELECT_ROLL_NUMBER = 2;
const MAX_ROLL_NUMBER = 100;
const MAX_SELECT_ROLL_NUMBER = 96;
const DEFAULT_ROLL_NUMBER = 50;
const DIVIDEND = 0.98;
const MIN_INPUT_BET_AMOUNT = 0.1;

const {
  Link, Element, Events, scroll, scrollSpy,
} = Scroll;

const { initSocketConnection } = betActions;
const { getIdentity, transfer, setErrorMessage } = appActions;

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
      dataSource: [{
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
      }, {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
      }],

      betAmount,
      rollNumber,
      payout,
      payoutOnWin,
      winChance,
      eosBalance: 0,
      betxBalance: 0,
      username: this.defaultUsername,
      betAsset: 'EOS',
      referrer: '',
      seed: '',
    };

    this.columns = [{
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
      dataIndex: 'bet',
      key: 'bet',
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
      render: (text) => text == 0 ? <span style={{ color: 'red' }}>{text}</span> : <span style={{ color: 'lightgreen' }}>{text}</span>,
    },
    {
      title: '',
      key: '',
      render: (item) => (
        <Icon type="right" />
      ),
    },
    ];

    this.onTabClicked = this.onTabClicked.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.onBetAmountButtonClick = this.onBetAmountButtonClick.bind(this);
    this.getSliderValue = this.getSliderValue.bind(this);
    this.onBetClicked = this.onBetClicked.bind(this);
    this.onLogInClicked = this.onLogInClicked.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { initSocketConnectionReq } = this.props;
    Events.scrollEvent.register('begin', (...rest) => {
      console.log('begin', rest);
    });

    Events.scrollEvent.register('end', (...rest) => {
      console.log('end', rest);
    });

    initSocketConnectionReq({ collection: 'Bet' });
  }

  componentWillReceiveProps(nextProps) {
    const { username, eosBalance, betxBalance } = nextProps;

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

    this.setState(fieldsToUpdate);
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  onTabClicked() {

  }

  onInputNumberChange(evt) {
    const { payout, betAsset } = this.state;
    const { intl } = this.props;

    const { value } = evt.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

    if ((!isNaN(value) && reg.test(value)) || value === '') {
      // this.props.onChange(value);

      console.log(_.toNumber(value));

      if (_.toNumber(value) !== 0 && _.toNumber(value) < MIN_INPUT_BET_AMOUNT) {
        message.warning(intl.formatMessage({
          id: 'dice.error.lessThanMinBet',

        }, {
          amount: MIN_INPUT_BET_AMOUNT.toFixed(4),
          asset: betAsset,
        }));
      }

      const betAmount = value;
      const payoutOnWin = calculatePayoutOnWin(betAmount, payout);

      this.setState({
        betAmount,
        payoutOnWin,
      });
    }
  }

  onBetAmountButtonClick(e) {
    const { eosBalance: balance, betAmount, payout } = this.state;

    const targetValue = e.currentTarget.getAttribute('data-value');

    let newBetAmount = betAmount;

    if (targetValue === MAX_BALANCE_STR) { // For "MAX" case
      newBetAmount = balance;
    } else if (targetValue === '1' || targetValue === '-1') { // For +1 and -1 cases; don't set upper limit with balance;
      newBetAmount = _.max([betAmount + _.toNumber(targetValue), 0]);
    } else if (targetValue === '0.5' || targetValue === '2') { // For 0.5x and 2x cases; don't set upper limit with balance;
      newBetAmount = _.max([betAmount * _.toNumber(targetValue), 0]);
    }

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
      rollNumber, username, betAmount, betAsset, referrer, seed,
    } = this.state;
    const { transferReq, setErrorMessageReq } = this.props;

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
      seed,
    });
  }

  render() {
    const { columns } = this;
    const {
      dataSource, betAmount, payoutOnWin, winChance, payout, rollNumber, eosBalance, betxBalance, username,
    } = this.state;

    const { user, betHistory } = this.props;

    // const betData = _.isEmpty(betHistory.all()) ? [] : _.map(betHistory.all(), (bet) => ({
    //   key: bet.id,
    //   time: moment(bet.time).format('HH:mm:ss'),
    //   bettor: bet.bettor,
    //   rollUnder: bet.rollUnder,
    //   bet: _.floor(bet.bet,3),
    //   roll: bet.roll,
    //   payout: _.floor(bet.payout,4),
    // }));

    // test data
    const betData = [
      {
        key: '123',
        time: '123',
        bettor: 'sss',
        rollUnder: 'bet.rollUnder',
        bet: 100,
        roll: 88,
        payout: 120,
      },
      {
        key: '124',
        time: '123',
        bettor: 'sss',
        rollUnder: 'bet.rollUnder',
        bet: 100,
        roll: 88,
        payout: 0,
      },
    ];

    return (
      <div>
        <div id="dicepage">
          <div className="wrapper">
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <section>
                  {/* <div className="horizontalWrapper"> */}
                  <div className="container">
                    <div className="currency_change">
                      <Row type="flex" justify="space-around" align="middle" style={{ height: '100%' }}>
                        <Button size="large" className="bet_button active" type="default" data-value="EOS">EOS
                        </Button>
                        <Popover content={(<IntlMessages id="dice.alert.comingsoon" />)}>
                          <Button size="large" className="bet_button" type="default" data-value="BETX" >BETX
                          </Button>
                        </Popover>
                      </Row>
                    </div>
                    <div className="action holderBorder">
                      <Row type="flex" gutter={0}>
                        <Col span={8}>
                          <div className="box">
                            <span className="label"><IntlMessages id="dice.play.notice" />
                            </span>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <span className="label"><IntlMessages id="dice.play.payout" />
                            </span>
                          </div>

                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <span className="label"><IntlMessages id="dice.play.win" />
                            </span>
                          </div>
                        </Col>
                      </Row>

                      <Row type="flex" gutter={0}>
                        <Col span={8}>
                          <div className="box">
                            <div className="value">{rollNumber}↓
                            </div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <div className="value ratio">{_.floor(payout, 3)}X
                            </div>
                          </div>

                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <div className="value">{(_.floor(winChance, 4) * 100).toFixed(2)}%
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row type="flex" justify="center">
                        <Col span={24}>
                          <Slider getValue={this.getSliderValue} defaultValue={DEFAULT_ROLL_NUMBER} min={MIN_SELECT_ROLL_NUMBER} max={MAX_SELECT_ROLL_NUMBER} />
                        </Col>
                      </Row>
                      <Row type="flex" gutter={36} justify="center" align="middle">

                        <Col span={24}>
                          <div className="inputgroup">
                            <div className="inner">
                              <Row type="flex" justify="center" align="middle">
                                <Col span={8}>
                                  <Row type="flex" justify="center" align="middle">
                                    <Col span={16} style={{ transform: 'translateY(-15px)' }}>
                                      <span className="label"><IntlMessages id="dice.play.amount" /></span>
                                      <Input size="large" className="inputBorder" onChange={this.onInputNumberChange} value={betAmount} />
                                    </Col>
                                    <Col span={8}>
                                      <Row type="flex" justify="center" align="middle">
                                        <Col span={24}>
                                          <button className="change_value_button" onClick={this.onBetAmountButtonClick} data-value="1">+</button>
                                        </Col>
                                        <Col span={24}>
                                          <button className="change_value_button" onClick={this.onBetAmountButtonClick} data-value="-1">-</button>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={8}>
                                  <Row className="inputBorder" type="flex" justify="space-around" align="middle">
                                    <Button size="large" className="bet_button" type="default" onClick={this.onBetAmountButtonClick} data-value="0.5" >1/2
                                    </Button>
                                    <Button size="large" className="bet_button" type="default" onClick={this.onBetAmountButtonClick} data-value="2" >2X
                                    </Button>
                                    <Button size="large" className="bet_button" type="default" onClick={this.onBetAmountButtonClick} data-value={MAX_BALANCE_STR} >{MAX_BALANCE_STR}
                                    </Button>
                                  </Row>
                                </Col>
                                <Col span={8} >
                                  <Row type="flex" justify="center" align="middle">
                                    <Col span={16} offset={8} style={{ transform: 'translateY(-15px)' }}>
                                      <span className="label"><IntlMessages id="dice.reward.total" /></span>
                                      <Input size="large" disabled className="inputBorder" value={_.floor(payoutOnWin, 4)} />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>

                          </div>
                        </Col>
                      </Row>
                      <Row type="flex" gutter={36}>

                        <Col span={24}>
                          {/* <div className="timer">
                      56
                          </div> */}
                        </Col>
                      </Row>
                      <Row type="flex" justify="center" align="middle" gutter={36}>
                        <Col span={6}>
                          <div className="bet_description"><IntlMessages id="dice.balance.eos" /></div>
                          <div className="bet_value">{_.floor(eosBalance, 2)}<span className="highlight"> <IntlMessages id="dice.asset.eos" /></span></div>
                        </Col>
                        <Col span={12}>

                          {username === this.defaultUsername ? <Button className="btn-login" size="large" type="primary" onClick={this.onLogInClicked}><IntlMessages id="dice.button.login" /></Button> : <Button className="btn-login" size="large" type="primary" onClick={this.onBetClicked}><IntlMessages id="dice.button.bet" /></Button> }
                          <div className="bet_description"><Icon type="question-circle" /><IntlMessages id="dice.reward.firstbet" /> {appConfig.firstBetReward} <IntlMessages id="dice.asset.betx" /></div>
                        </Col>
                        <Col span={6}>
                          <div className="bet_description"><IntlMessages id="dice.balance.betx" /></div>
                          <div className="bet_value">{_.floor(betxBalance, 2)}<span className="highlight"> <IntlMessages id="dice.asset.betx" /></span></div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {/* </div> */}
                </section>
              </Col>
              <Col xs={24} lg={8}>

                <section className='hideOnMobile'>
                  <div className="container">
                    <div className="holderBorder">
                      <Chatroom />
                    </div>
                  </div>
                </section>
              </Col>
              <Col xs={24} lg={24}>

                <section id="tables" >
                  {/* <div className="horizontalWrapper"> */}
                  <div className="container">
                    <Tabs defaultActiveKey="1" onChange={this.onTabClicked} size="large">
                      <TabPane tab={<IntlMessages id="dice.history.all" />} key="1">
                        <Table
                          className="holderBorder"
                          columns={columns}
                          dataSource={betData}
                          bordered={false}
                          showHeader
                          pagination={false}
                        />
                      </TabPane>
                      <TabPane tab={<IntlMessages id="dice.history.my" />} key="2">
                        <Table
                          className="holderBorder"
                          columns={columns}
                          dataSource={betData}
                          bordered={false}
                          showHeader
                          pagination={false}
                        />
                      </TabPane>
                      <TabPane tab={<IntlMessages id="dice.history.huge" />} key="3">
                        <Table
                          className="holderBorder"
                          columns={columns}
                          dataSource={betData}
                          bordered={false}
                          showHeader
                          pagination={false}
                        />
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
};

DicePage.defaultProps = {
  transferReq: undefined,
  initSocketConnectionReq: undefined,
  betHistory: undefined,
  refresh: false,
  username: undefined,
  eosBalance: undefined,
  betxBalance: undefined,
  getIdentityReq: undefined,
  setErrorMessageReq: undefined,
};

const mapStateToProps = (state) => ({
  betHistory: state.Bet.get('history'),
  refresh: state.Bet.get('refresh'),
  username: state.App.get('username'),
  eosBalance: state.App.get('eosBalance'),
  betxBalance: state.App.get('betxBalance'),
});

const mapDispatchToProps = (dispatch) => ({
  transferReq: (obj) => dispatch(transfer(obj)),
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  getIdentityReq: () => dispatch(getIdentity()),
  setErrorMessageReq: (message) => dispatch(setErrorMessage(message)),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DicePage));
