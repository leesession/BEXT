import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardFinished from '../components/bodhi-dls/cardFinished';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import topicActions from '../redux/topic/actions';

class TopicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      topic: undefined, // Topic object for this page
    };

    this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
  }

  componentWillMount() {
    const { getTopicsSuccess, onGetTopics } = this.props;

    // Retrive topic data if state doesn't already have it
    if (_.isUndefined(getTopicsSuccess)) {
      onGetTopics();
    } else {
      const topic = _.find(getTopicsSuccess, { address: this.state.address });
      this.setState({ topic });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getTopicsSuccess } = nextProps;

    if (!_.isEmpty(getTopicsSuccess)) {
      const topic = _.find(getTopicsSuccess, { address: this.state.address });

      this.setState({ topic });
    } else {
      console.log('getOraclesSuccess is empty');
    }
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
  }

  /** Withdraw button on click handler passed down to CardFinished */
  onWithdrawClicked(obj) {
    const senderAddress = this.getCurrentSenderAddress();
    const contractAddress = 'fe99572f3f4fbd3ad266f2578726b24bd0583396';

    this.props.onWithdraw(contractAddress, senderAddress);
  }


  /** Return selected address on Topbar as sender * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;
    return walletAddrs[walletAddrsIndex].address;
  }

  render() {
    const { requestReturn } = this.props;
    const { topic } = this.state;

    if (!topic) {
      // TODO: render no result page
      return <div></div>;
    }

    const timeline = [{
      label: 'Prediction start block',
      value: topic.blockNum,
    }, {
      label: 'Prediction end block',
      value: topic.bettingEndBlock || 56000,
    }];

    const qtumTotal = _.sum(topic.qtumAmount);
    const qtumBalance = _.map(topic.qtumAmount, (amount, idx) => ({
      name: topic.options[idx],
      value: `${amount} QTUM`,
      percent: _.floor((amount / qtumTotal) * 100),
    }));


    const botTotal = _.sum(topic.botAmount);
    const botBalance = _.map(topic.botAmount, (amount, idx) => ({
      name: topic.options[idx],
      value: `${amount} BOT`,
      percent: _.floor((amount / botTotal) * 100),
    }));

    const topicElement = (<Row
      gutter={28}
      justify="center"
    >

      <Col xl={12} lg={12}>
        <IsoWidgetsWrapper padding="32px" >

          <CardInfo
            title={topic.name}
            timeline={timeline}
          >

          </CardInfo>
        </IsoWidgetsWrapper>

      </Col>
      <Col xl={12} lg={12}>
        <IsoWidgetsWrapper padding="32px">
          <CardFinished
            amount={qtumTotal}
            voteBalance={qtumBalance}
            onWithdrawClicked={this.onWithdrawClicked}
            radioIndex={topic.resultIdx}
            result={requestReturn}
          >
            {qtumBalance.map((entry) => (
              <ProgressBar
                key={entry.name}
                label={entry.name}
                value={entry.value}
                percent={entry.percent}
                barHeight={12}
                info
                marginBottom={18}
              />))}
          </CardFinished>
        </IsoWidgetsWrapper>
      </Col>

    </Row>);

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Completed</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {topicElement}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

TopicPage.propTypes = {
  onGetTopics: PropTypes.func,
  getTopicsSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  match: PropTypes.object.isRequired,
  requestReturn: PropTypes.object,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  onWithdraw: PropTypes.func,
  onClearRequestReturn: PropTypes.func,
};

TopicPage.defaultProps = {
  getTopicsSuccess: undefined,
  onGetTopics: undefined,
  requestReturn: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  onWithdraw: undefined,
  onClearRequestReturn: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  requestReturn: state.Topic.get('req_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
    onWithdraw: () => dispatch(topicActions.onWithdraw()),
    onClearRequestReturn: () => dispatch(topicActions.onClearRequestReturn()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
