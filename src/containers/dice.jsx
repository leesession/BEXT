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
      balance: 0,
    };

    this.columns = [{
      title: 'Time',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Bettor',
      dataIndex: 'bettor',
      key: 'bettor',
    }, {
      title: 'Roll Under',
      dataIndex: 'rollunder',
      key: 'rollunder',
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
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', (...rest) => {
      console.log('begin', rest);
    });

    Events.scrollEvent.register('end', (...rest) => {
      console.log('end', rest);
    });
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
      const newBetAmount = _.max(betAmount * targetValue, balance);
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

  render() {
    const { columns } = this;
    const {
      dataSource, betAmount, payoutOnWin, winChance, payout, rollNumber,
    } = this.state;

    return (
      <div id="dicepage">
        <section>
          <div className="horizontalWrapper">

            <div className="container">
              <div className="action">
                <Row type="flex" gutter={36}>
                  <Col span={12}>
                    <div className="inputgroup">
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
                  </Col>
                  <Col span={12}>
                    <div className="box">
                      <span className="label">Payout on win
                      </span>
                      <div className="value">{_.floor(payoutOnWin, 4)}
                      </div>
                    </div>
                  </Col>

                  <Col span={24}>
                    <Row type="flex">
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
                  </Col>
                  <Col span={24}>
                    <Row type="flex">
                      <Col span={8}>
                      </Col>
                      <Col span={8}>
                        <Button className="button" size="large" type="primary">Login</Button>
                      </Col>
                      <Col span={8}>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="history">
                <Row type="flex" justify="center">
                  <Col span={12}>
                    <Slider getValue={this.getSliderValue} defaultValue={DEFAULT_ROLL_NUMBER} min={MIN_SELECT_ROLL_NUMBER} max={MAX_SELECT_ROLL_NUMBER} />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </section>

        <section >
          <div className="horizontalWrapper">

            <Tabs defaultActiveKey="1" onChange={this.onTabClicked} size="large">
              <TabPane tab="All Bets" key="1">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  bordered
                  showHeader
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="My Bets" key="2">Content of Tab Pane 2</TabPane>
              <TabPane tab="Huge Wins" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>


          </div>
        </section>

        <InfoSection />
      </div>
    );
  }
}

DicePage.propTypes = {
};

DicePage.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(DicePage);
