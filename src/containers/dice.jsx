/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Icon, Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
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
      balance: 1000,
      username: `Guest-${_.random(100000, 999999, false)}`,
    };

    this.columns = [{
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: '玩家',
      dataIndex: 'bettor',
      key: 'bettor',
    }, {
      title: '投注号码',
      dataIndex: 'rollUnder',
      key: 'rollUnder',
    },
    {
      title: '赌注',
      dataIndex: 'bet',
      key: 'bet',
    },
    {
      title: '开奖号码',
      dataIndex: 'roll',
      key: 'roll',
      render:text=>(
        <span style={{color:'#e6c36b'}}>{text}</span>
      )
    },
    {
      title: '奖金',
      dataIndex: 'payout',
      key: 'payout',
      render:text=>{
        return text == 0 ? <span style={{color:'red'}}>{text}</span> : <span style={{color:'lightgreen'}}>{text}</span>
      }
    },
    {
      title: '',
      key:'',
      render:item => (
        <Icon type="right" />
      )
    }
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
    let newBetAmount = 0;

    if (targetValue === MAX_BALANCE_STR) {
      const newBetAmount = balance;

      const payoutOnWin = calculatePayoutOnWin(newBetAmount, payout);

      this.setState({
        betAmount: newBetAmount,
        payoutOnWin,
      });
    }else{
      if(targetValue==1|| targetValue==-1){
        newBetAmount = parseFloat(betAmount)+parseFloat(targetValue) ;
        newBetAmount = newBetAmount < 0 ? 0 : newBetAmount > balance ? balance : newBetAmount;
      }else{
        newBetAmount = _.min(betAmount * targetValue, balance);
      }
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

    // const betData = _.isEmpty(betHistory.all()) ? [] : _.map(betHistory.all(), (bet) => ({
    //   key: bet.id,
    //   time: moment(bet.time).format('HH:mm:ss'),
    //   bettor: bet.bettor,
    //   rollUnder: bet.rollUnder,
    //   bet: _.floor(bet.bet,3),
    //   roll: bet.roll,
    //   payout: _.floor(bet.payout,4),
    // }));

    //test data
    const betData = [
      {
      key: '123',
      time: '123',
      bettor: 'sss',
      rollUnder: 'bet.rollUnder',
      bet: 100,
      roll: 88,
      payout: 120
      },
      {
        key: '124',
        time: '123',
        bettor: 'sss',
        rollUnder: 'bet.rollUnder',
        bet: 100,
        roll: 88,
        payout: 0
        }
    ]
    


    return (
      <div>
        <div id="dicepage">
          <div className="wrapper">
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <section>
                  {/* <div className="horizontalWrapper"> */}
                  <div className="container">
                    <div className='currency_change'>
                      <Row type='flex' justify='space-around' align='middle' style={{height:'100%'}}>
                          <Button size="large" className='bet_button active' type="default" data-value='EOS'>EOS
                          </Button>
                          <Button size="large" className='bet_button' type="default" data-value='BETX' >BETX
                          </Button>
                      </Row>
                    </div>
                    <div className="action holderBorder">
                      <Row type="flex" gutter={0}>
                        <Col span={8}>
                          <div className="box">
                            <span className="label">小于该点数获胜
                            </span>
                            <div className="value">{rollNumber}↓
                            </div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <span className="label">赔率
                            </span>
                            <div className="value ratio">1.01X
                            </div>
                          </div>

                        </Col>
                        <Col span={8}>
                          <div className="box">
                            <span className="label">中奖概率
                            </span>
                            <div className="value">{(_.ceil(winChance, 2) * 100).toFixed(2)}%
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row type="flex" justify="center">
                              <Col span={24}>
                                <Slider getValue={this.getSliderValue} defaultValue={DEFAULT_ROLL_NUMBER} min={MIN_SELECT_ROLL_NUMBER} max={MAX_SELECT_ROLL_NUMBER} />
                              </Col>
                      </Row>
                      <Row type="flex" gutter={36} justify='center' align='middle'>

                        <Col span={24}>
                          <div className="inputgroup">
                            <div className="inner">
                              <Row type='flex' justify='center' align='middle'>
                                  <Col span={8}>
                                  <Row type='flex' justify='center' align='middle'>
                                    <Col span={16} style={{transform:'translateY(-15px)'}}>
                                        <span className="label">抵押金额</span>
                                        <Input size='large' className='inputBorder' onChange={this.onInputNumberChange} value={betAmount} />
                                    </Col>
                                    <Col span={8}>
                                      <Row type='flex' justify='center' align='middle'>
                                        <Col span={24}>
                                        <button className='change_value_button' onClick={this.onBetAmountButtonClick} data-value={1}>+</button>
                                        </Col>
                                        <Col span={24}>
                                        <button className='change_value_button' onClick={this.onBetAmountButtonClick} data-value={-1}>-</button>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  </Col>
                                  <Col span={8}>
                                  <Row className='inputBorder' type='flex' justify='space-around' align='middle'>
                                    <Button size="large" className='bet_button' type="default" onClick={this.onBetAmountButtonClick} data-value={0.5} >1/2
                                    </Button>
                                    <Button size="large" className='bet_button' type="default" onClick={this.onBetAmountButtonClick} data-value={2} >2X
                                    </Button>
                                    <Button size="large" className='bet_button' type="default" onClick={this.onBetAmountButtonClick} data-value={MAX_BALANCE_STR} >{MAX_BALANCE_STR}
                                    </Button>
                                  </Row>
                                  </Col>
                                  <Col span={8} >
                                  <Row type='flex' justify='center' align='middle'>
                                    <Col span={16} offset={8} style={{transform:'translateY(-15px)'}}>
                                    <span className="label">赢得奖金</span>
                                    <Input size='large' disabled='true' className='inputBorder' value={_.floor(payoutOnWin, 4)} />
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
                      <Row type="flex" justify='center' align='middle' gutter={36}>
                        <Col span={6}>
                        <div className='bet_description'>EOS余额</div>
                        <div className='bet_value'>3.9402<span className='highlight'> EOS</span></div>
                        </Col>
                        <Col span={12}>
                          <Button className="btn-login" size="large" type="primary" onClick={this.onBetClicked}>下注</Button>
                          <div className='bet_description'><Icon type="question-circle" />投注奖励20000BETX</div>
                        </Col>
                        <Col span={6}>
                        <div className='bet_description'>BETX余额</div>
                        <div className='bet_value'>3.9402<span className='highlight'> BETX</span></div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {/* </div> */}
                </section>
              </Col>
              <Col xs={24} lg={8}>

                <section>
                  <div className="container">
                    <div className='holderBorder'>
                      <Chatroom />
                    </div>
                  </div>
                </section>
              </Col>
              <Col xs={24} lg={24}>

                <section id="tables" >
                  {/* <div className="horizontalWrapper"> */}
                  <div className='container'>
                  <Tabs defaultActiveKey="1" onChange={this.onTabClicked} size="large">
                    <TabPane tab="所有投注" key="1">
                      <Table
                        className = 'holderBorder' 
                        columns={columns}
                        dataSource={betData}
                        bordered={false}
                        showHeader
                        pagination={false}
                      />
                    </TabPane>
                    <TabPane tab="我的投注" key="2">
                    <Table
                        className = 'holderBorder' 
                        columns={columns}
                        dataSource={betData}
                        bordered={false}
                        showHeader
                        pagination={false}
                      />
                    </TabPane>
                    <TabPane tab="Huge Wins" key="3">
                    <Table
                        className = 'holderBorder' 
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
  betHistory:undefined,
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
