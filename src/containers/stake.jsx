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
import { formatNumberThousands, secondsToTime, getRestDaySeconds } from '../helpers/utility';
import LoginModal from '../components/loginModal';
import UnstakeModal from '../components/unstakeModal';

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
      isUnstakeModalVisible: false,
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.onStakeBtnClicked = this.onStakeBtnClicked.bind(this);
    this.onUnstakeBtnClicked = this.onUnstakeBtnClicked.bind(this);
    this.onClaimBtnClicked = this.onClaimBtnClicked.bind(this);
    this.onWithdrawBtnClicked = this.onWithdrawBtnClicked.bind(this);
    this.onInputStakeChange = this.onInputStakeChange.bind(this);
    this.onInputUnstakeChange = this.onInputUnstakeChange.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleUnstakeModal = this.toggleUnstakeModal.bind(this);
    this.onSelectUnstakeOption = this.onSelectUnstakeOption.bind(this);
  }

  componentWillMount() {
    const {
      getPageData, getMyStakeAndDividend, getContractSnapshot, getContractDividend, username,
    } = this.props;

    getContractSnapshot();
    getContractDividend();

    getPageData('stake');

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
    this.startTimer(getRestDaySeconds(8));
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
      const restOfDaySeconds = getRestDaySeconds(8);
      this.setState({
        seconds: restOfDaySeconds,
        time: restOfDaySeconds,
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

    this.toggleUnstakeModal(true);
  }

  toggleLoginModal(visible) {
    this.setState({
      isLoginModalVisible: visible,
    });
  }

  toggleUnstakeModal(visible) {
    this.setState({
      isUnstakeModalVisible: visible,
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

  onWithdrawBtnClicked() {
    const {
      username, withdraw, myAvailable,
    } = this.props;

    if (!username) {
      this.toggleLoginModal(true);
      return;
    }

    const quantity = `${_.floor(myAvailable, 4).toFixed(4)} BETX`;

    withdraw({
      username,
      quantity,
    });
  }

  onSelectUnstakeOption(evt) {
    const { inputUnstake } = this.state;
    const { username, unstake } = this.props;
    const { speed } = evt.target.dataset;

    const quantity = `${_.floor(_.toNumber(inputUnstake), 4).toFixed(4)} BETX`;

    unstake({
      username,
      quantity,
      speed,
    });

    setTimeout(() => {
      this.toggleUnstakeModal(false);
    }, 500);
  }

  render() {
    const {
      pageData,
      myBetxBalance, mySnapshotTotal, mySnapshotEffective, myStake, myDividend, myFrozen, myAvailable,
      platformSnapshotTotal, platformDividend, locale,
    } = this.props;

    const {
      inputStake, inputUnstake, isLoginModalVisible, isUnstakeModalVisible, time,
    } = this.state;

    // const termText =
    // (<div><p><IntlMessages id="stake.rule.body1" /></p><p className="highlight"><IntlMessages id="stake.rule.body2" /> </p><p><IntlMessages id="stake.rule.body3" /> </p></div>);
    const termText =
      (<div><p><IntlMessages id="stake.rule.body1" /></p><div className="formula-img"><CloudinaryImage publicId={`${'betx/first-divid'}-${locale}`} options={{ height: 100, crop: 'scale' }} /></div><p><IntlMessages id="stake.rule.body3" /> </p></div>);


    const colWidth = {
      xs: 24,
      xl: 24,
      xxl: 24,
    };

    const myExpectedDiv = (pageData && pageData.todayDividend) ? ((1.0 * mySnapshotEffective) / platformSnapshotTotal) * pageData.todayDividend : 0;
    const divPerMil = (pageData && pageData.todayDividend) ? (1000000 / platformSnapshotTotal) * pageData.todayDividend : 0;

    const fronzeStr = formatNumberThousands(_.floor(myFrozen, 2));
    const availableStr = `${formatNumberThousands(_.floor(myAvailable, 2))} BETX`;

    return (
      <div id="faq-page" className="stake-page">
        <div className="horizontalWrapper">
          <Row type="flex" justify="center">
            <Col {...colWidth}>
              <h1 className="page-title"><IntlMessages id="stake.title" /></h1>
            </Col>
            <Col {...colWidth} className="border-bottom">
              <h3 className="page-sub-title sub_title_stake stake_block"><IntlMessages id="stake.dividend.rest" /> ({<Icon type="clock-circle" />} <span style={{ color: 'white', letterSpacing: 2 }}>{time.h}:{time.m}:{time.s}</span>)</h3>
            </Col>
            <Col {...colWidth}>
              <Row gutter={90}>
                <Col xs={24} md={12} className="page-dividend border-right">
                  <Row gutter={50} type="flex" justify="center" align="middle">
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.dividend.allday" /></p>
                      <div className="page-third-title panel icon-container third_title_stake">
                        <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(pageData && pageData.todayDividend, 2))} EOS
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.dividend.issuedTotal" /></p>
                      <div className="page-third-title panel icon-container third_title_stake">
                        <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(pageData && pageData.totalDividend, 2))} EOS</div>
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
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.platformTotal" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(platformSnapshotTotal))} BETX</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.per100k" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(divPerMil, 4))} EOS</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.myStake" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(mySnapshotEffective))} BETX</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="page-dividend-detail-box">
                              <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.predicate" /></p>
                              <p className="page-third-title third_title_stake" >{formatNumberThousands(_.floor(myExpectedDiv, 4))} EOS</p>
                            </div>
                          </Col>
                          {/* <Col span={12}>
                          <div className="page-dividend-detail-box">
                            <p className="page-third-title third_title_stake" ><IntlMessages id="stake.income.betx" /></p>
                            <p className="page-third-title third_title_stake" >{_.floor(divPerMilBETX,4)} EOS</p>
                            </div>
                          </Col> */}
                        </Row>
                        <Row type="flex" align="middle" className="page-dividend-detail-bottom claim-bottom">
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
                        {formatNumberThousands(_.floor(pageData && pageData.staked, 2))} BETX
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title sub_title_stake"><IntlMessages id="stake.betx.circulate" /></p>
                      <div className="page-third-title third_title_stake panel icon-container" >
                        <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                        {formatNumberThousands(_.floor(pageData && pageData.circulation, 2))} BETX</div>
                    </Col>
                  </Row>
                  <Row className="stake-container" >
                    <Col span={24} className="border-bottom">
                      <div className="page-dividend-section-title page-sub-title stake_block sub_title_stake"><IntlMessages id="stake.token.pledge" /></div>
                    </Col>
                    <Col span={24} >
                      <div className="stake-container-body panel-trans  stake-container-body-extend">
                        <Row>
                          <Col span={24} >
                            <div className="stake-container-body-inner">
                              <Row >
                                <Col span={24} className="page-third-title third_title_stake text-left"><IntlMessages id="stake.token.betx" /></Col>
                                <Col span={24} className="page-third-title third_title_stake panel-trans">
                                  <div className="stake-container-body-inner-input">
                                    <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <Input className="clear-input" value={inputStake} onChange={this.onInputStakeChange} onBlur={() => window.scroll(0, 0)} ></Input>
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
                                <Col span={24} className="page-third-title third_title_stake text-left">
                                  <IntlMessages id="stake.betx.redemption" />
                                </Col>
                                <Col span={24} className="page-third-title third_title_stake panel-trans">
                                  <div className="stake-container-body-inner-input">
                                    <div className="img-container"><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <Input className="clear-input" value={inputUnstake} onChange={this.onInputUnstakeChange} onBlur={() => window.scroll(0, 0)} ></Input>
                                    <Button className="clear-btn" onClick={this.onUnstakeBtnClicked}><IntlMessages id="stake.action.redemption" /></Button>
                                  </div>
                                </Col>
                                <Col span={24} className="page-third-title third_title_stake" style={{ color: 'white' }}>
                                  <Row type="flex" justify="space-around" align="middle">
                                    <Col className="text-left" span={8}><IntlMessages id="stake.available" /></Col>
                                    <Col className="text-right" span={16}>{formatNumberThousands(_.floor(myStake, 2))} BETX ({fronzeStr} <IntlMessages id="stake.frozen" />)</Col>
                                  </Row>
                                </Col>
                                <div className="stake-third-extend">
                                  <Row type="flex" align="middle" className="page-dividend-detail-bottom claim-bottom">
                                    <div className="page-third-title third_title_stake text-right"><IntlMessages id="stake.income.withdraw" /></div>
                                    <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></div>
                                    <div className="page-third-title third_title_stake text-left" style={{ color: 'white' }} >{availableStr} </div>
                                    <div className="getStake-btn-holder"><Button className="getStake-btn" onClick={this.onWithdrawBtnClicked}><IntlMessages id="stake.income.button.withdraw" /></Button></div>
                                  </Row>
                                </div>
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
        <UnstakeModal
          isVisible={isUnstakeModalVisible}
          closeModal={this.toggleUnstakeModal}
          onSelect={this.onSelectUnstakeOption}
        />
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
  myFrozen: PropTypes.number,
  myAvailable: PropTypes.number,
  platformSnapshotTotal: PropTypes.number,
  platformDividend: PropTypes.number,
  platformStake: PropTypes.number,
  allVolume: PropTypes.number,
  locale: PropTypes.string,
  getMyStakeAndDividend: PropTypes.func,
  getContractSnapshot: PropTypes.func,
  getContractDividend: PropTypes.func,
  getTodayDividend: PropTypes.func,
  username: PropTypes.string,
  stake: PropTypes.func,
  unstake: PropTypes.func,
  claimDividend: PropTypes.func,
  withdraw: PropTypes.func,
  setErrorMessage: PropTypes.func,
  todayDividend: PropTypes.number,
  getPageData: PropTypes.func,
  pageData: PropTypes.object,
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
  myFrozen: 0,
  myAvailable: 0,
  platformSnapshotTotal: 0,
  platformDividend: 0,
  platformStake: 0,
  locale: 'en',
  getMyStakeAndDividend: undefined,
  getContractSnapshot: undefined,
  getContractDividend: undefined,
  getTodayDividend: undefined,
  username: undefined,
  stake: undefined,
  unstake: undefined,
  claimDividend: undefined,
  withdraw: undefined,
  setErrorMessage: undefined,
  todayDividend: undefined,
  getPageData: undefined,
  pageData: undefined,
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
  myFrozen: state.Stake.get('myFrozen'),
  myAvailable: state.Stake.get('myAvailable'),
  platformSnapshotTotal: state.Stake.get('contractSnapshotTotal'),
  platformDividend: state.Stake.get('contractDividend'),
  platformStake: state.Stake.get('contractStake'),
  username: state.App.get('username'),
  todayDividend: state.Stake.get('todayDividend'),
  pageData: state.App.get('stakePageData'),
});

const mapDispatchToProps = (dispatch) => ({
  getBetVolume: () => dispatch(betActions.getBetVolume()),
  getBETXStakeAmount: () => dispatch(betActions.getBETXStakeAmount()),
  getBETXCirculation: () => dispatch(stakeActions.getBETXCirculation()),
  getMyStakeAndDividend: (username) => dispatch(stakeActions.getMyStakeAndDividend(username)),
  getContractSnapshot: () => dispatch(stakeActions.getContractSnapshot()),
  getContractDividend: () => dispatch(stakeActions.getContractDividend()),
  getTodayDividend: () => dispatch(stakeActions.getTodayDividend()),
  stake: (params) => dispatch(stakeActions.stake(params)),
  unstake: (params) => dispatch(stakeActions.unstake(params)),
  getPageData: (name) => dispatch(appActions.getPageData(name)),
  claimDividend: (params) => dispatch(stakeActions.claimDividend(params)),
  withdraw: (params) => dispatch(stakeActions.withdraw(params)),
  setErrorMessage: (message) => dispatch(appActions.setErrorMessage(message)),
});


// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StakePage));
