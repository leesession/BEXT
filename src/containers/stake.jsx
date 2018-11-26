/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Icon, Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import * as Scroll from 'react-scroll';
import moment from 'moment';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import IntlMessages from '../components/utility/intlMessages';
import betActions from '../redux/bet/actions';
import { appConfig } from '../settings';
import { formatNumberThousands } from '../helpers/utility';
const TabPane = Tabs.TabPane;

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const {
  Link, Element, Events, scroll, scrollSpy,
} = Scroll;

/**
 * Convert seconds to days hours mins and seconds
 * @param  {[type]} secs [description]
 * @return {[type]}      [description]
 */
export function secondsToTime(secs) {
  const days = Math.floor(secs / 86400);
  let numSeconds = secs % 86400;
  const hours = Math.floor(numSeconds / 3600);
  numSeconds %= 3600;
  const minutes = Math.floor(numSeconds / 60);
  const seconds = Math.ceil(numSeconds % 60);

  const obj = {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  };

  return obj;
}

class StakePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: {
        d: 0,
        h: 0,
        m: 0,
        s: 0,
      },
      seconds: 0,
      inputStake: 0,
      inputReclaim: 0,
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentWillMount() {
    const { getBetVolume, getBETXStakeAmount } = this.props;

    getBetVolume();
    getBETXStakeAmount();
  }

  componentDidMount() {
    const utcNow = moment.utc();
    const endOfDay = moment.utc().endOf('day');
    const diffDuration = moment.duration(endOfDay.diff(utcNow)).asSeconds();
    // const remainingTimeOfDay = `${diffDuration.hours()}:${diffDuration.minutes()}:${diffDuration.seconds()}`;

    this.startTimer(diffDuration);
  }

  componentWillUnmount() {
    const { timer } = this;

    // Clear countdown timer on page
    clearInterval(this.timer);
  }

  startTimer(seconds) {
    if (seconds > 0 && this.timer === 0) {
      this.setState({
        seconds,
        time: secondsToTime(seconds),
      });

      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    const { seconds } = this.state;

    // Check isMounted to try not to setState after unmount
    if (this.timer && seconds !== 0) {
      this.setState({
        time: secondsToTime(seconds - 1),
        seconds: seconds - 1,
      });
    }

    // Check if we're at zero.
    if (seconds <= 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    const {
      intl, dailyVolume, allVolume, betxStakeAmount, betxCirculation, myBetxBalance, myStakedBetxBalance,
    } = this.props;
    const { time, inputStake, inputReclaim } = this.state;

    const termTextParts = intl.formatMessage({ id: 'stake.rule.body' }).split('\n');
    const termText = _.map(termTextParts, (part, partIndex) => <p key={partIndex}>{part}</p>);

    const myExpectedDiv = 0;
    const DivPer10KBETX = 0;
    const myAvailableDiv = 0;

    return (
      <div id="faq-page">
        <div className="wrapper">
          <Row type="flex" justify="center">
            <Col xs={24} md={20} xl={16}>
              <h1 className="page-title"><IntlMessages id="stake.title" /></h1>
            </Col>
            <Col xs={24} md={20} xl={16} className="border-bottom">
              <h3 className="page-sub-title"><IntlMessages id="stake.dividend.rest" />({<Icon type="clock-circle" />} <span style={{ color: 'white', letterSpacing: 2 }}>{`${time.h}:${time.m}:${time.s}`}</span>)</h3>
            </Col>
            <Col xs={24} md={20} xl={16}>
              <Row gutter={90}>
                <Col xs={24} md={12} className="page-dividend border-right">
                  <Row gutter={50} type="flex" justify="center" align="middle">
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.dividend.allday" /></p>
                      <div className="page-third-title panel icon-container">
                        <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {_.floor(dailyVolume * appConfig.dividendRatio, 4)} EOS
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.dividend.total" /></p>
                      <div className="page-third-title panel icon-container">
                        <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {_.floor(allVolume * appConfig.dividendRatio, 4)} EOS</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} className="border-bottom text-left">
                      <div className="page-sub-title page-dividend-section-title"><IntlMessages id="stake.dividend.my" /></div>
                    </Col>
                    <Col span={24}>
                      <div className="page-dividend-detail panel-trans">
                        <Row className="border-bottom">
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                            <p className="page-third-title" ><IntlMessages id="stake.income.predicate" /></p>
                            <p className="page-third-title" >{myExpectedDiv} EOS</p>
                            </div>
                          </Col>
                          <Col span={12}>
                          <div className="page-dividend-detail-box">
                            <p className="page-third-title" ><IntlMessages id="stake.income.betx" /></p>
                            <p className="page-third-title" >{DivPer10KBETX} EOS</p>
                            </div>
                          </Col>
                        </Row>
                        <Row type="flex" align="middle" className="page-dividend-detail-bottom">
                          <Col className="page-third-title text-right" span={6}><IntlMessages id="stake.income.rest" /></Col>
                          <Col span={2} style={{ marginTop: 12 }}><CloudinaryImage publicId="eos-logo-grey" options={{ height: 30, crop: 'scale' }} /></Col>
                          <Col className="page-third-title text-left" style={{ color: 'white' }} span={10}>{myAvailableDiv} EOS</Col>
                          <Col className="getStake-btn-holder" span={6}><Button className="getStake-btn"><IntlMessages id="stake.income.get" /></Button></Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} md={12} style={{ marginTop: 30 }}>
                  <Row gutter={50} type="flex" justify="center" align="middle">
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.betx.pledge" /></p>
                      <div className="page-third-title panel icon-container" >
                        <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(betxStakeAmount)} EOS
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.betx.circulate" /></p>
                      <div className="page-third-title panel icon-container" >
                        <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(betxCirculation)} EOS</div>
                    </Col>
                  </Row>
                  <Row className="stake-container" >
                    <Col span={24} className="border-bottom">
                    <div className="page-dividend-section-title page-sub-title"><IntlMessages id="stake.token.pledge" /></div>
                    </Col>
                    <Col span={24} >
                      <div className="stake-container-body panel-trans">
                      <Row>
                        <Col span={12} className="border-right">
                          <div className="stake-container-body-inner">
                            <Row >
                              <Col span={24} className="page-third-title text-left"><IntlMessages id="stake.token.betx" /></Col>
                              <Col span={24} className="page-third-title panel-trans">
                                <div className="stake-container-body-inner-input">
                                    <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <Input className="clear-input" value={inputStake} ></Input>
                                    <Button className="clear-btn"><IntlMessages id="stake.action.pledge" /></Button>
                                </div>
                              </Col>
                              <Col span={24} className="page-third-title" style={{ color: 'white' }}>
                                <Row type="flex" justify="space-around" align="middle">
                                  <Col className="text-left" span={12}><IntlMessages id="stake.available" /></Col>
                                  <Col className="text-right" span={12}>{myBetxBalance} BETX</Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="stake-container-body-inner">
                            <Row >
                              <Col span={24} className="page-third-title text-left"><IntlMessages id="stake.betx.redemption" /></Col>
                              <Col span={24} className="page-third-title panel-trans">
                                <div className="stake-container-body-inner-input">
                                    <div className="img-container"><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <Input className="clear-input" value={inputReclaim} ></Input>
                                    <Button className="clear-btn"><IntlMessages id="stake.action.redemption" /></Button>
                                </div>
                              </Col>
                              <Col span={24} className="page-third-title" style={{ color: 'white' }}>
                                <Row type="flex" justify="space-around" align="middle">
                                  <Col className="text-left" span={12}><IntlMessages id="stake.available" /></Col>
                                  <Col className="text-right" span={12}>{myStakedBetxBalance} BETX</Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={20} xl={16}>
              <div className="page-term">
                <h2 className="page-sub-title"><IntlMessages id="stake.rule.title" /></h2>
                <div className="page-term-body">
                  <div className="page-term-body-inner panel">{termText}</div>
                </div>
              </div>
            </Col>

          </Row>
        </div>
      </div>
    );
  }
}

StakePage.propTypes = {
  intl: intlShape.isRequired,
  getBetVolume: PropTypes.func,
  getBETXStakeAmount: PropTypes.func,
  dailyVolume: PropTypes.number,
  betxStakeAmount: PropTypes.number,
  betxCirculation: PropTypes.number,
  myBetxBalance: PropTypes.number,
  myStakedBetxBalance: PropTypes.number,
};

StakePage.defaultProps = {
  getBetVolume: undefined,
  getBETXStakeAmount: undefined,
  dailyVolume: 0,
  allVolume: 0,
  betxStakeAmount: 0,
  betxCirculation: 0,
  myBetxBalance: 0,
  myStakedBetxBalance: 0,
};

const mapStateToProps = (state) => ({
  dailyVolume: state.Bet.get('dailyVolume'),
  allVolume: state.Bet.get('allVolume'),
  betxStakeAmount: state.Bet.get('betxStakeAmount'),
  betxCirculation: state.Bet.get('betxCirculation'),
});

const mapDispatchToProps = (dispatch) => ({
  getBetVolume: () => dispatch(betActions.getBetVolume()),
  getBETXStakeAmount: () => dispatch(betActions.getBETXStakeAmount()),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StakePage));
