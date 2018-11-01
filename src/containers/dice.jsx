/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Scroll from 'react-scroll';
import moment from 'moment';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';

import InfoSection from '../components/sections/info';
import Slider from '../components/slider';
import Chatroom from '../components/chatroom';
import betActions from '../redux/bet/actions';

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

const {
  Link, Element, Events, scroll, scrollSpy,
} = Scroll;

const { initSocketConnection, sendTransaction } = betActions;


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
      balance: 10,
      username: `Guest-${_.random(100000, 999999, false)}`,
    };

    this.columns = [{
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: 'Bettor',
      dataIndex: 'bettor',
      key: 'bettor',
    }, {
      title: 'Roll Under',
      dataIndex: 'rollUnder',
      key: 'rollUnder',
    },
    {
      title: 'Bet',
      dataIndex: 'bet',
      key: 'bet',
    },
    {
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
    },
    {
      title: 'Payout',
      dataIndex: 'payout',
      key: 'payout',
    },
    ];

    this.onTabClicked = this.onTabClicked.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.onBetAmountButtonClick = this.onBetAmountButtonClick.bind(this);
    this.getSliderValue = this.getSliderValue.bind(this);
    this.onBetClicked = this.onBetClicked.bind(this);
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

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  // handleSetActive(to) {
  //   console.log(to);
  // }
  onTabClicked() {

  }

  onInputNumberChange(value) {
    const { payout } = this.state;
    const betAmount = value;
    const payoutOnWin = calculatePayoutOnWin(betAmount, payout);

    this.setState({
      betAmount,
      payoutOnWin,
    });
  }

  onBetAmountButtonClick(e) {
    const { balance, betAmount, payout } = this.state;

    const targetValue = e.currentTarget.getAttribute('data-value');

    if (_.isNumber(targetValue)) {
      const newBetAmount = _.min(betAmount * targetValue, balance);
      const payoutOnWin = calculatePayoutOnWin(newBetAmount, payout);

      this.setState({
        betAmount: newBetAmount,
        payoutOnWin,
      });
    } else if (targetValue === MAX_BALANCE_STR) {
      const newBetAmount = balance;

      const payoutOnWin = calculatePayoutOnWin(newBetAmount, payout);

      this.setState({
        betAmount: newBetAmount,
        payoutOnWin,
      });
    }
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

  onBetClicked() {
    const { rollNumber, username, betAmount } = this.state;
    const { sendTransactionReq } = this.props;

    sendTransactionReq({
      bettor: username,
      betAmount,
      rollUnder: rollNumber,
    });
  }

  render() {
    const { columns } = this;
    const {
      dataSource, betAmount, payoutOnWin, winChance, payout, rollNumber,
    } = this.state;

    const { betHistory } = this.props;

    const betData = _.isEmpty(betHistory.all()) ? [] : _.map(betHistory.all(), (bet) => ({
      key: bet.id,
      time: moment(bet.time).format('HH:mm:ss'),
      bettor: bet.bettor,
      rollUnder: bet.rollUnder,
      bet: _.floor(bet.bet,3),
      roll: bet.roll,
      payout: _.floor(bet.payout,4),
    }));

    return (
      <div>
        <div id="dicepage">
          <div className="wrapper">
            <Row gutter={80}>
              <Col xs={24} lg={12}>
                <section>
                  {/* <div className="horizontalWrapper"> */}
                  <div className="container">
                    <div className="action">
                      <Row type="flex" gutter={0}>
                        <Col span={8}>
                          <div className="box">
                            <span className="label">Roll under to win
                            </span>
                            <div className="value">{rollNumber}↓
                            </div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <span className="label">Payout
                            </span>
                            <div className="value">{_.floor(payout, 2)}X
                            </div>
                          </div>

                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <span className="label">Win chance
                            </span>
                            <div className="value">{(_.ceil(winChance, 2) * 100).toFixed(2)}%
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row type="flex" gutter={36}>

                        <Col span={12}>
                          <div className="inputgroup">
                            <div className="inner">

                              <span className="label">Bet Amount</span>
                              <InputGroup compact>
                                <Button size="large" type="default" onClick={this.onBetAmountButtonClick} data-value={0.5} >1/2
                                </Button>
                                <Button size="large" type="default" onClick={this.onBetAmountButtonClick} data-value={2} >2X
                                </Button>
                                <Button size="large" type="default" onClick={this.onBetAmountButtonClick} data-value={MAX_BALANCE_STR} >{MAX_BALANCE_STR}
                                </Button>
                                <InputNumber size="large" defaultValue="1" onChange={this.onInputNumberChange} value={betAmount} />
                              </InputGroup>
                            </div>

                          </div>
                        </Col>
                        <Col span={12} >
                          <div className="inputgroup">
                            <div className="box">
                              <span className="label">Payout on win
                              </span>
                              <div className="value">{_.floor(payoutOnWin, 4)}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row type="flex" gutter={36}>

                        <Col span={24}>
                          {/* <div className="timer">
                      56
                          </div> */}

                          <div className="history">
                            <Row type="flex" justify="center">
                              <Col span={16}>
                                <Slider getValue={this.getSliderValue} defaultValue={DEFAULT_ROLL_NUMBER} min={MIN_SELECT_ROLL_NUMBER} max={MAX_SELECT_ROLL_NUMBER} />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      <Row type="flex" gutter={36}>
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                          <Button className="btn-login" size="large" type="primary" onClick={this.onBetClicked}>Bet</Button>
                        </Col>
                        <Col span={8}>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {/* </div> */}
                </section>
              </Col>
              <Col xs={24} lg={12}>

                <section>
                  <div className="container">
                    <Chatroom />
                  </div>
                </section>
              </Col>
              <Col xs={24} lg={24}>

                <section id="tables" >
                  {/* <div className="horizontalWrapper"> */}
                  <Tabs defaultActiveKey="1" onChange={this.onTabClicked} size="large">
                    <TabPane tab="All Bets" key="1">
                      <Table
                        columns={columns}
                        dataSource={betData}
                        bordered={false}
                        showHeader
                        pagination={false}
                      />
                    </TabPane>
                    <TabPane tab="My Bets" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Huge Wins" key="3">Content of Tab Pane 3</TabPane>
                  </Tabs>
                  {/* </div> */}
                </section>
              </Col>
            </Row>
          </div>
        </div>
        <InfoSection />
      </div>
    );
  }
}

DicePage.propTypes = {
  sendTransactionReq: PropTypes.func,
  initSocketConnectionReq: PropTypes.func,
  betHistory: PropTypes.object,
  refresh: PropTypes.bool,
};

DicePage.defaultProps = {
  sendTransactionReq: undefined,
  initSocketConnectionReq: undefined,
  betHistory: undefined,
  refresh: false,
};

const mapStateToProps = (state) => ({
  betHistory: state.Bet.get('history'),
  refresh: state.Bet.get('refresh'),
});

const mapDispatchToProps = (dispatch) => ({
  sendTransactionReq: (obj) => dispatch(sendTransaction(obj)),
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(DicePage);
