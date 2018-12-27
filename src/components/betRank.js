import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Table } from 'antd';
import _ from 'lodash';

import IntlMessages from './utility/intlMessages';
import betActions from '../redux/bet/actions';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import { secondsToTime, formatNumberThousands } from '../helpers/utility';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

class BetRank extends React.Component {
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
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);


    this.columns = [{
      title: <IntlMessages id="dice.rank.rank" />,
      dataIndex: 'key',
      key: 'key',
      render: (text) => (
        <span>{text}</span>
      ),
      width: '25%',
    }, {
      title: <IntlMessages id="dice.rank.bettor" />,
      dataIndex: 'bettor',
      key: 'bettor',
      render: (text) => (
        <span>{text}</span>
      ),
      width: '25%',
    }, {
      title: <IntlMessages id="dice.rank.wager" />,
      dataIndex: 'betAmount',
      key: 'betAmount',
      render: (text) => (
        <span>{text}</span>
      ),
      width: '25%',
    }, {
      title: <IntlMessages id="dice.rank.prize" />,
      dataIndex: 'reward',
      key: 'reward',
      render: (text) => (
        <span className="ranking-td">{text}</span>
      ),
      width: '25%',
    }];
  }

  componentDidMount() {
    const { startPollBetRank, username } = this.props;

    startPollBetRank({ username });

    const utcNow = moment.utc();
    const endOfDay = moment.utc().endOf('day').subtract(8, 'hours');
    const diffDuration = moment.duration(endOfDay.diff(utcNow)).asSeconds();
    this.startTimer(diffDuration);
  }

  componentWillReceiveProps(nextProps) {
    const { username } = nextProps;
    const { startPollBetRank } = this.props;

    if (username) {
      startPollBetRank({ username });
    }
  }

  componentWillUnmount() {
    const { timer } = this;

    // Clear countdown timer on page
    clearInterval(timer);
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

  render() {
    const { time } = this.state;
    const { betRank } = this.props;

    const tableData = _.isUndefined(betRank) ? [] : _.map(betRank.top, (entry) => ({
      key: entry.rank,
      bettor: entry.bettor,
      betAmount: `${formatNumberThousands(_.floor(entry.betAmount, 2))} EOS`,
      reward: `${formatNumberThousands(_.floor(entry.reward, 2))} EOS`,
    }));

    const firstPlace = tableData.shift();
    const secondPlace = tableData.shift();
    const thirdPlace = tableData.shift();
    const myPlace = _.cloneDeep(betRank && betRank.myRank);

    if (myPlace) {
      myPlace.betAmount = `${myPlace.betAmount ? formatNumberThousands(_.floor(myPlace.betAmount, 2)) : 0} EOS`;
      myPlace.reward = `${myPlace.reward ? formatNumberThousands(_.floor(myPlace.reward, 2)) : 0} EOS`;
    }

    return (<div className="container rank">
      <div className="rank-container holderBorder">
        <Row>
          <Col xs={24} lg={12}>
            <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
              <Col xs={24} lg={24} className="rank-title">
                <p className="rank-title-text"><IntlMessages id="dice.rank.leadboard" /></p>
                <p className="rank-title-countdown">{_.padStart(time.h, 2, '0')}:{_.padStart(time.m, 2, '0')}:{_.padStart(time.s, 2, '0')}</p>
              </Col>
              <Col xs={24} lg={24}>
                <div className="rankingHolder">
                  <div className="rankingItem">
                    <div className="crown-box second">
                      <span className="crown-text">2</span>
                      <CloudinaryImage className="crown-img" publicId="betx/crown-silver" />
                    </div>
                  </div>
                  <div className="rankingItem ">
                    <div className="crown-box first">
                      <span className="crown-text">1</span>
                      <CloudinaryImage className="crown-img" publicId="betx/crown-gold" />
                    </div>
                  </div>
                  <div className="rankingItem ">
                    <div className="crown-box third">
                      <span className="crown-text">3</span>
                      <CloudinaryImage className="crown-img" publicId="betx/crown-bronze" />
                    </div>
                  </div>
                </div>
                <div className="rankingHolder">
                  <div className="rankingItem second">
                    <span>{secondPlace && secondPlace.bettor}</span>
                    <span className="description">{secondPlace && secondPlace.betAmount}</span>
                    <span className="description reward">{secondPlace && secondPlace.reward}</span>
                  </div>
                  <div className="rankingItem first">
                    <span>{firstPlace && firstPlace.bettor}</span>
                    <span className="description">{firstPlace && firstPlace.betAmount}</span>
                    <span className="description reward">{firstPlace && firstPlace.reward}</span>
                  </div>
                  <div className="rankingItem third">
                    <span>{thirdPlace && thirdPlace.bettor}</span>
                    <span className="description">{thirdPlace && thirdPlace.betAmount}</span>
                    <span className="description reward">{thirdPlace && thirdPlace.reward}</span>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={0}>
                <Row className="rank-mine">
                  <Col span={6}>{myPlace && myPlace.rank ? myPlace.rank : '-' }(<IntlMessages id="dice.rank.me" />)</Col>
                  <Col span={6}>{myPlace && myPlace.bettor ? myPlace.bettor : '-'}</Col>
                  <Col span={6}>{myPlace && myPlace.betAmount ? myPlace.betAmount : '-'}</Col>
                  <Col span={6}>{myPlace && myPlace.reward ? myPlace.reward : '-'}</Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={0} lg={12}>
            <Table
              showHeader
              dataSource={tableData}
              columns={this.columns}
              bordered={false}
              pagination={false}
              scroll={{ y: 300 }}
              // style={{ height: '300px' }}
            />
            <Row className="rank-mine rank-mine-lg">
              <Col span={6}>{myPlace && myPlace.rank ? myPlace.rank : '-'}(<IntlMessages id="dice.rank.me" />)</Col>
              <Col span={6}>{myPlace && myPlace.bettor ? myPlace.bettor : '-'}</Col>
              <Col span={6}>{myPlace && myPlace.betAmount ? myPlace.betAmount : '-'}</Col>
              <Col span={6}>{myPlace && myPlace.reward ? myPlace.reward : '-'}</Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>);
  }
}

BetRank.propTypes = {
  startPollBetRank: PropTypes.func,
  betRank: PropTypes.object,
  username: PropTypes.string,
};

BetRank.defaultProps = {
  startPollBetRank: undefined,
  betRank: undefined,
  username: undefined,
};

const mapStateToProps = (state) => ({
  betRank: state.Bet.get('betRank'),
  username: state.App.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  startPollBetRank: (params) => dispatch(betActions.startPollBetRank(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BetRank);
