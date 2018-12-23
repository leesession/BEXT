/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Row, Col, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import IntlMessages from '../components/utility/intlMessages';
import stakeActions from '../redux/stake/actions';
import betActions from '../redux/bet/actions';
import appActions from '../redux/app/actions';
import { appConfig } from '../settings';
import { formatNumberThousands, secondsToTime } from '../helpers/utility';
import LoginModal from '../components/loginModal';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

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
      inputUnstake: 0,
      isLoginModalVisible: false,
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.onStakeBtnClicked = this.onStakeBtnClicked.bind(this);
    this.onUnstakeBtnClicked = this.onUnstakeBtnClicked.bind(this);
    this.onClaimBtnClicked = this.onClaimBtnClicked.bind(this);
    this.onInputStakeChange = this.onInputStakeChange.bind(this);
    this.onInputUnstakeChange = this.onInputUnstakeChange.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
  }

  componentWillMount() {
    const {
      getBetVolume, getBETXStakeAmount, getBETXCirculation, getMyStakeAndDividend, getContractSnapshot, getContractDividend, username,
    } = this.props;

    getBetVolume();
    getBETXStakeAmount();
    getBETXCirculation();

    getContractSnapshot();
    getContractDividend();

    if (username) {
      getMyStakeAndDividend(username);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { username } = nextProps;

    const { getMyStakeAndDividend } = this.props;
    const { isLoginModalVisible } = this.state;

    if (username) {
      getMyStakeAndDividend(username);

      if (isLoginModalVisible) {
        this.toggleLoginModal(false);
      }
    }
  }

  componentDidMount() {
    const utcNow = moment.utc();
    const endOfDay = moment.utc().endOf('day').subtract(8, 'hours');
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
      const utcNow = moment.utc();
      const endOfDay = moment.utc().endOf('day').subtract(8, 'hours');
      const newSeconds = moment.duration(endOfDay.diff(utcNow)).asSeconds();

      this.setState({
        seconds: newSeconds,
        time: secondsToTime(newSeconds),
      });
    }
  }

  onInputStakeChange(evt) {
    this.setState({
      inputStake: evt.target.value,
    });
  }

  onInputUnstakeChange(evt) {
    this.setState({
      inputUnstake: evt.target.value,
    });
  }

  onStakeBtnClicked() {
    const { inputStake } = this.state;
    const { username, stake, setErrorMessage } = this.props;

    const amount = _.toNumber(inputStake);

    if (!username) {
      this.toggleLoginModal(true);
      return;
    }

    if (!_.isNumber(amount) || amount <= 0) {
      setErrorMessage('message.error.amountInvalid');
      return;
    }

    const quantity = `${_.floor(amount, 4).toFixed(4)} BETX`;

    stake({
      username,
      quantity,
    });
  }

  onUnstakeBtnClicked() {
    const { inputUnstake } = this.state;
    const { username, unstake, setErrorMessage } = this.props;

    const amount = _.toNumber(inputUnstake);

    if (!username) {
      this.toggleLoginModal(true);
      return;
    }

    if (!_.isNumber(amount) || amount <= 0) {
      setErrorMessage('message.error.amountInvalid');
      return;
    }

    const quantity = `${_.floor(amount, 4).toFixed(4)} BETX`;

    unstake({
      username,
      quantity,
    });
  }

  toggleLoginModal(visible) {
    this.setState({
      isLoginModalVisible: visible,
    });
  }

  onClaimBtnClicked(e) {
    const {
      username, claimDividend, myDividend, setErrorMessage,
    } = this.props;
    if (!username) {
      this.toggleLoginModal(true);
      return;
    }

    const quantity = `${_.floor(myDividend, 4).toFixed(4)} EOS`;

    claimDividend({
      username,
      quantity,
    });
  }

  render() {
    const {
      intl, dailyVolume, allVolume, betxStakeAmount, betxCirculation,
      myBetxBalance, mySnapshotTotal, mySnapshotEffective, myStake, myDividend, platformSnapshotTotal, platformDividend, platformStake, locale,
    } = this.props;
    const {
      time, inputStake, inputUnstake, isLoginModalVisible,
    } = this.state;

    // const termText =
    // (<div><p><IntlMessages id="stake.rule.body1" /></p><p className="highlight"><IntlMessages id="stake.rule.body2" /> </p><p><IntlMessages id="stake.rule.body3" /> </p></div>);
    const termText =
    (<div><p><IntlMessages id="stake.rule.body1" /></p><div className="formula-img"><CloudinaryImage publicId={`${'betx/first-divid'}-${locale}`} options={{ height: 100, crop: 'scale' }} /></div><p><IntlMessages id="stake.rule.body3" /> </p></div>);

    // const totalDividend = platformDividend;
    // const DivPer10KBETX = totalDividend * (10000.0 / betxCirculation);

    const colWidth = {
      xs: 24,
      xl: 20,
      xxl: 18,
    };

    const myExpectedDiv = platformSnapshotTotal === 0 ? 0 : ((1.0 * mySnapshotEffective) / platformSnapshotTotal) * platformDividend;

    return (
      <div id="faq-page">
        <div className="wrapper wrapper_stake">
          <Row type="flex" justify="center">
            <Col {...colWidth}>
              <h1 className="page-title"><IntlMessages id="stake.title" /></h1>
            </Col>
            <Col {...colWidth} className="border-bottom">
              <h3 className="page-sub-title sub_title_stake stake_block"><IntlMessages id="stake.dividend.rest" /> ({<Icon type="clock-circle" />} <span style={{ color: 'white', letterSpacing: 2 }}>--:--:--</span>)</h3>
            </Col>
            <Col {...colWidth}>
              <Row gutter={90}>
                <Col xs={24} md={12} className="page-dividend border-right">
                  <Row gutter={50} type="flex" justify="center" align="middle">
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.dividend.allday" /></p>
                      <div className="page-third-title panel icon-container third_title_stake">
                        <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(dailyVolume * appConfig.dividendRatio, 4))} EOS
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.dividend.total" /></p>
                      <div className="page-third-title panel icon-container third_title_stake">
                        <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(platformDividend, 2))} EOS</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} className="border-bottom text-left">
                      <div className="page-sub-title sub_title_stake stake_block page-dividend-section-title"><IntlMessages id="stake.dividend.my" /></div>
                    </Col>
                    <Col span={24}>
                      <div className="page-dividend-detail panel-trans">
                        <Row className="border-bottom page-dividend-detail-top">
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.mySnapshotEffective" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(mySnapshotEffective, 2))} BETX</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.mySnapshotTotal" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(mySnapshotTotal, 2))} BETX</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.platformSnapshot" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(platformSnapshotTotal, 2))} BETX</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.predicate" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(myExpectedDiv, 2))} EOS</p>
                            </div>
                          </Col>
                          {/* <Col span={12}>
                          <div className="page-dividend-detail-box">
                            <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.betx" /></p>
                            <p className="page-third-title third_title_stake" >{_.floor(DivPer10KBETX,4)} EOS</p>
                            </div>
                          </Col> */}
                        </Row>
                        <Row type="flex" align="middle" className="page-dividend-detail-bottom">
                          <div className="page-third-title third_title_stake text-right"><IntlMessages id="stake.income.rest" /></div>
                          <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                          <div className="page-third-title third_title_stake text-left" style={{ color: 'white' }} >{myDividend} EOS</div>
                          <div className="getStake-btn-holder" span={6}><Button className="getStake-btn" onClick={this.onClaimBtnClicked}><IntlMessages id="stake.income.get" /></Button></div>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} md={12} style={{ marginTop: 30 }}>
                  <Row gutter={50} type="flex" justify="center" align="middle">
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.betx.pledge" /></p>
                      <div className="page-third-title third_title_stake panel icon-container" >
                        <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(platformStake, 2))} BETX
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.betx.circulate" /></p>
                      <div className="page-third-title third_title_stake panel icon-container" >
                        <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(betxCirculation, 2))} BETX</div>
                    </Col>
                  </Row>
                  <Row className="stake-container" >
                    <Col span={24} className="border-bottom">
                      <div className="page-dividend-section-title page-sub-title stake_block sub_title_stake"><IntlMessages id="stake.token.pledge" /></div>
                    </Col>
                    <Col span={24} >
                      <div className="stake-container-body panel-trans">
                        <Row>
                          <Col span={24} >
                            <div className="stake-container-body-inner">
                              <Row >
                                <Col span={24} className="page-third-title third_title_stake text-left"><IntlMessages id="stake.token.betx" /></Col>
                                <Col span={24} className="page-third-title third_title_stake panel-trans">
                                  <div className="stake-container-body-inner-input">
                                    <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <Input className="clear-input" value={inputStake} onChange={this.onInputStakeChange} ></Input>
                                    <Button className="clear-btn" onClick={this.onStakeBtnClicked}><IntlMessages id="stake.action.pledge" /></Button>
                                  </div>
                                </Col>
                                <Col span={24} className="page-third-title" style={{ color: 'white' }}>
                                  <Row type="flex" justify="space-around" align="middle">
                                    <Col className="text-left" span={12}><IntlMessages id="stake.available" /></Col>
                                    <Col className="text-right" span={12}>{formatNumberThousands(_.floor(myBetxBalance, 2))} BETX</Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                          <Col span={24}>
                            <div className="stake-container-body-inner">
                              <Row >
                                <Col span={24} className="page-third-title third_title_stake text-left"><IntlMessages id="stake.betx.redemption" /></Col>
                                <Col span={24} className="page-third-title third_title_stake panel-trans">
                                  <div className="stake-container-body-inner-input">
                                    <div className="img-container"><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <Input className="clear-input" value={inputUnstake} onChange={this.onInputUnstakeChange} ></Input>
                                    <Button className="clear-btn" onClick={this.onUnstakeBtnClicked}><IntlMessages id="stake.action.redemption" /></Button>
                                  </div>
                                </Col>
                                <Col span={24} className="page-third-title third_title_stake" style={{ color: 'white' }}>
                                  <Row type="flex" justify="space-around" align="middle">
                                    <Col className="text-left" span={12}><IntlMessages id="stake.available" /></Col>
                                    <Col className="text-right" span={12}>{formatNumberThousands(_.floor(myStake, 2))} BETX</Col>
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

            <Col {...colWidth}>
              <div className="page-term">
                <h2 className="page-sub-title sub_title_stake"><IntlMessages id="stake.rule.title" /></h2>
                <div className="page-term-body">
                  <div className="page-term-body-inner panel normal-font">{termText}</div>
                </div>
              </div>
            </Col>

          </Row>
        </div>

        <LoginModal isVisible={isLoginModalVisible} closeModal={this.toggleLoginModal} />
      </div>
    );
  }
}

StakePage.propTypes = {
  intl: intlShape.isRequired,
  getBetVolume: PropTypes.func,
  getBETXStakeAmount: PropTypes.func,
  getBETXCirculation: PropTypes.func,
  dailyVolume: PropTypes.number,
  betxStakeAmount: PropTypes.number,
  betxCirculation: PropTypes.number,
  myBetxBalance: PropTypes.number,
  mySnapshotTotal: PropTypes.number,
  mySnapshotEffective: PropTypes.number,
  myStake: PropTypes.number,
  myDividend: PropTypes.number,
  platformSnapshotTotal: PropTypes.number,
  platformDividend: PropTypes.number,
  platformStake: PropTypes.number,
  allVolume: PropTypes.number,
  locale: PropTypes.string,
  getMyStakeAndDividend: PropTypes.func,
  getContractSnapshot: PropTypes.func,
  getContractDividend: PropTypes.func,
  username: PropTypes.string,
  stake: PropTypes.func,
  unstake: PropTypes.func,
  claimDividend: PropTypes.func,
  setErrorMessage: PropTypes.func,
};

StakePage.defaultProps = {
  getBetVolume: undefined,
  getBETXStakeAmount: undefined,
  getBETXCirculation: undefined,
  dailyVolume: 0,
  allVolume: 0,
  betxStakeAmount: 0,
  betxCirculation: 0,
  myBetxBalance: 0,
  mySnapshotTotal: 0,
  mySnapshotEffective: 0,
  myStake: 0,
  myDividend: 0,
  platformSnapshotTotal: 0,
  platformDividend: 0,
  platformStake: 0,
  locale: 'en',
  getMyStakeAndDividend: undefined,
  getContractSnapshot: undefined,
  getContractDividend: undefined,
  username: undefined,
  stake: undefined,
  unstake: undefined,
  claimDividend: undefined,
  setErrorMessage: undefined,
};

const mapStateToProps = (state) => ({
  dailyVolume: state.Bet.get('dailyVolume'),
  allVolume: state.Bet.get('allVolume'),
  betxStakeAmount: state.Bet.get('betxStakeAmount'),
  betxCirculation: state.Stake.get('betxCirculation'),
  myBetxBalance: state.App.get('betxBalance'),
  locale: state.LanguageSwitcher.language.locale,
  mySnapshotTotal: state.Stake.get('mySnapshotTotal'),
  mySnapshotEffective: state.Stake.get('mySnapshotEffective'),
  myStake: state.Stake.get('myStake'),
  myDividend: state.Stake.get('myDividend'),
  platformSnapshotTotal: state.Stake.get('contractSnapshotTotal'),
  platformDividend: state.Stake.get('contractDividend'),
  platformStake: state.Stake.get('contractStake'),
  username: state.App.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  getBetVolume: () => dispatch(betActions.getBetVolume()),
  getBETXStakeAmount: () => dispatch(betActions.getBETXStakeAmount()),
  getBETXCirculation: () => dispatch(stakeActions.getBETXCirculation()),
  getMyStakeAndDividend: (username) => dispatch(stakeActions.getMyStakeAndDividend(username)),
  getContractSnapshot: () => dispatch(stakeActions.getContractSnapshot()),
  getContractDividend: () => dispatch(stakeActions.getContractDividend()),
  stake: (params) => dispatch(stakeActions.stake(params)),
  unstake: (params) => dispatch(stakeActions.unstake(params)),
  claimDividend: (params) => dispatch(stakeActions.claimDividend(params)),
  setErrorMessage: (message) => dispatch(appActions.setErrorMessage(message)),
});


// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StakePage));
