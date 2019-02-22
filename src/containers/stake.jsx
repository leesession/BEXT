/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Row, Col } from 'antd';
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
import LoginModal from '../components/modal/login';
import UnstakeModal from '../components/unstakeModal';
import Input from '../components/uielements/input';
import Button from '../components/uielements/button';

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
      isUnstakeModalVisible: false,
      isLoginModalVisible: false,

      todayDividendStr: undefined,
      divIssuedStr: undefined,
      totalStakeStr: undefined,
      circulationStr: undefined,
      divPerMilStr: undefined,
      myDivTodayStr: undefined,

      myStakeStr: undefined,
      myAvailableNum: undefined,
      myFrozenStr: undefined,
      myBetxNum: undefined,
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
      getPageData, getMyStakeAndDividend, username,
    } = this.props;

    getPageData('stake');

    if (username) {
      getMyStakeAndDividend(username);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      username, myStake, myAvailable, myFrozen, myBetxBalance, pageData,
    } = nextProps;

    const { getMyStakeAndDividend } = this.props;
    const { isLoginModalVisible } = this.state;

    const fieldsToUpdate = {};

    if (username) {
      getMyStakeAndDividend(username);

      if (isLoginModalVisible) {
        this.toggleLoginModal(false);
      }
    }

    const todayDividend = (pageData && pageData.todayDividend) || 0;
    fieldsToUpdate.todayDividendStr = formatNumberThousands(_.floor(todayDividend, 2));

    const divIssued = (pageData && pageData.totalDividend) || 0;
    fieldsToUpdate.divIssuedStr = formatNumberThousands(_.floor(divIssued));

    const totalStake = pageData && pageData.staked;
    fieldsToUpdate.totalStakeStr = formatNumberThousands(_.floor(totalStake));

    const circulation = pageData && pageData.circulation;
    fieldsToUpdate.circulationStr = formatNumberThousands(_.floor(circulation));

    fieldsToUpdate.myStakeStr = `${formatNumberThousands(_.floor(myStake || 0))} BETX`;
    fieldsToUpdate.myAvailableNum = formatNumberThousands(_.floor(myAvailable || 0, 2));
    fieldsToUpdate.myFrozenStr = `${formatNumberThousands(_.floor(myFrozen || 0, 2))} BETX`;
    fieldsToUpdate.myBetxNum = formatNumberThousands(_.floor(myBetxBalance || 0, 2));

    const divPerMil = (todayDividend && totalStake) ? (1000000 / totalStake) * todayDividend : 0;
    fieldsToUpdate.divPerMilStr = `${formatNumberThousands(_.floor(divPerMil, 4))} EOS`;

    const myDivToday = (myStake && totalStake) ? ((1.0 * myStake) / totalStake) * todayDividend : 0;
    fieldsToUpdate.myDivTodayStr = `${formatNumberThousands(_.floor(myDivToday, 4))} EOS`;

    this.setState(fieldsToUpdate);
  }

  componentDidMount() {
    this.startTimer(getRestDaySeconds(8));
  }

  componentWillUnmount() {
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

  toggleLoginModal(value) {
    this.setState({
      isLoginModalVisible: value,
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
      pageData, locale, getIdentity,
    } = this.props;

    const {
      inputStake, inputUnstake, isLoginModalVisible, isUnstakeModalVisible, time,
      todayDividendStr, divIssuedStr, totalStakeStr, circulationStr, divPerMilStr, myDivTodayStr,
      myStakeStr, myFrozenStr, myAvailableNum, myBetxNum,
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

    return (
      <div id="stake-page">
        <div className="horizontalWrapper">
          <h1 className="page-title"><IntlMessages id="stake.title" /></h1>
          <div className="page-container">
            <Row type="flex" justify="center">
              <Col {...colWidth} className="">
                <h3 className="page-sub-title  "><IntlMessages id="stake.dividend.rest" /> ({<Icon type="clock-circle" />} <span style={{ letterSpacing: 2 }}>
                  {_.padStart(time.h, 2, '0')}:{_.padStart(time.m, 2, '0')}:{_.padStart(time.s, 2, '0')}
                </span>)</h3>
              </Col>
              <Col {...colWidth}>
                <Row gutter={90}>
                  <Col xs={24} md={12} style={{ marginTop: 30 }}>
                    <Row gutter={50} type="flex" justify="center" align="middle">
                      <Col span={12}>
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.dividend.allday" /></div>
                          <div className="box-middle">
                            <span className="box-input" >{todayDividendStr}</span>
                            <span className="box-input-inner-addOn">EOS</span>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.dividend.issuedTotal" /></div>
                          <div className="box-middle">
                            <span className="box-input" >{divIssuedStr}</span>
                            <span className="box-input-inner-addOn">EOS</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="stake-container">
                      <Row>
                        <Col span={12}>
                          <div className="box">
                            <p className="label" ><IntlMessages id="stake.income.platformTotal" /></p>
                            <p className="value" >{totalStakeStr}</p>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="box">
                            <p className="label" ><IntlMessages id="stake.income.per100k" /></p>
                            <p className="value" >{divPerMilStr}</p>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="box">
                            <p className="label" ><IntlMessages id="stake.income.myStake" /></p>
                            <p className="value" >{myStakeStr}</p>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="box">
                            <p className="label" ><IntlMessages id="stake.income.predicate" /></p>
                            <p className="value" >{myDivTodayStr}</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Button width={120} height={48} float="right" onClick={this.onClaimBtnClicked}><IntlMessages id="stake.income.get" /></Button>
                  </Col>

                  <Col xs={24} md={12} style={{ marginTop: 30 }}>
                    <Row gutter={50} type="flex" justify="center" align="middle">
                      <Col span={12}>
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.betx.pledge" /></div>
                          <div className="box-middle">
                            <span className="box-input">{totalStakeStr}</span>
                            <span className="box-input-inner-addOn">EOS</span>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.betx.circulate" /></div>
                          <div className="box-middle">
                            <span className="box-input">{circulationStr}</span>
                            <span className="box-input-inner-addOn">EOS</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="stake-container" >
                      <div className="stake-container-row">
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.token.betx" /></div>
                          <div className="box-middle">
                            <Input className="box-input" onBlur={() => window.scroll(0, 0)} onChange={this.onInputStakeChange} value={inputStake} />
                            <span className="box-input-inner-addOn">BETX</span>
                          </div>
                          <div className="box-bottom box-bottom-span">
                            <IntlMessages id="stake.available" values={{ amount: myBetxNum, symbol: 'BETX' }} />
                          </div>
                        </div>
                        <Button className="stake-container-btn" width={120} height={48} onClick={this.onStakeBtnClicked}><IntlMessages id="stake.action.pledge" /></Button>
                      </div>
                      <div className="stake-container-row">
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.betx.redemption" /></div>
                          <div className="box-middle">
                            <Input className="box-input" onBlur={() => window.scroll(0, 0)} onChange={this.onInputUnstakeChange} value={inputUnstake} />
                            <span className="box-input-inner-addOn">BETX</span>
                          </div>
                          <div className="box-bottom box-bottom-span">
                            <IntlMessages id="stake.unstakeAvailable" values={{ available: myStakeStr, frozenAmount: myFrozenStr }} />
                          </div>
                        </div>
                        <Button className="stake-container-btn" width={120} height={48} onClick={this.onUnstakeBtnClicked}><IntlMessages id="stake.action.redemption" /></Button>
                      </div>
                      <div className="stake-container-row">
                        <div className="box box-no-padding">
                          <div className="label label-float-top"><IntlMessages id="stake.income.withdraw" /></div>
                          <div className="box-middle">
                            <span className="box-input" >{myAvailableNum}</span>
                            <span className="box-input-inner-addOn">BETX</span>
                          </div>
                        </div>
                        <Button className="stake-container-btn" width={120} height={48} onClick={this.onWithdrawBtnClicked}><IntlMessages id="stake.income.button.withdraw" /></Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>

            </Row>
          </div>
          <h2 className="page-sub-title" style={{ marginTop: '24px' }}><IntlMessages id="stake.rule.title" /></h2>
          <div className="page-container" id="stake-term">
            <div className="page-term-body">
              <div className="page-term-body-inner panel normal-font">{termText}</div>
            </div>
          </div>
        </div >
        <LoginModal
          title={<IntlMessages id="modal.login.title" />}
          isVisible={isLoginModalVisible}
          onClose={() => this.toggleLoginModal(false)}
          onOk={() => getIdentity()}
        />
        <UnstakeModal
          isVisible={isUnstakeModalVisible}
          closeModal={this.toggleUnstakeModal}
          onSelect={this.onSelectUnstakeOption}
        />
      </div >
    );
  }
}

StakePage.propTypes = {
  intl: intlShape.isRequired,
  myBetxBalance: PropTypes.number,
  myStake: PropTypes.number,
  myDividend: PropTypes.number,
  myFrozen: PropTypes.number,
  myAvailable: PropTypes.number,
  locale: PropTypes.string,
  getMyStakeAndDividend: PropTypes.func,
  username: PropTypes.string,
  stake: PropTypes.func,
  unstake: PropTypes.func,
  claimDividend: PropTypes.func,
  withdraw: PropTypes.func,
  setErrorMessage: PropTypes.func,
  getPageData: PropTypes.func,
  pageData: PropTypes.object,
  getIdentity: PropTypes.func,
};

StakePage.defaultProps = {
  myBetxBalance: 0,
  myStake: 0,
  myDividend: 0,
  myFrozen: 0,
  myAvailable: 0,
  locale: 'en',
  getMyStakeAndDividend: undefined,
  username: undefined,
  stake: undefined,
  unstake: undefined,
  claimDividend: undefined,
  withdraw: undefined,
  setErrorMessage: undefined,
  getPageData: undefined,
  pageData: undefined,
  getIdentity: undefined,
};

const mapStateToProps = (state) => ({
  myBetxBalance: state.App.get('betxBalance'),
  locale: state.LanguageSwitcher.language.locale,
  myStake: state.Stake.get('myStake'),
  myDividend: state.Stake.get('myDividend'),
  myFrozen: state.Stake.get('myFrozen'),
  myAvailable: state.Stake.get('myAvailable'),
  username: state.App.get('username'),
  pageData: state.App.get('stakePageData'),
});

const mapDispatchToProps = (dispatch) => ({
  getPageData: (name) => dispatch(appActions.getPageData(name)),
  getMyStakeAndDividend: (username) => dispatch(stakeActions.getMyStakeAndDividend(username)),
  stake: (params) => dispatch(stakeActions.stake(params)),
  unstake: (params) => dispatch(stakeActions.unstake(params)),
  claimDividend: (params) => dispatch(stakeActions.claimDividend(params)),
  withdraw: (params) => dispatch(stakeActions.withdraw(params)),
  setErrorMessage: (message) => dispatch(appActions.setErrorMessage(message)),
  getIdentity: () => dispatch(appActions.getIdentity()),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StakePage));
