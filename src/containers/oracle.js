import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardVoting from '../components/bodhi-dls/cardVoting';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import topicActions from '../redux/topic/actions';

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = 0;

const OracleType = {
  CENTRALISED: 'CENTRALISED',
  DECENTRALISED: 'DECENTRALISED',
};

class OraclePage extends React.Component {
  /**
   * Determine OracleType; default DECENTRALISED
   * @param  {object} oracle Oracle object
   * @return {string}        OracleType
   */
  static getOracleType(oracle) {
    switch (oracle.token) {
      case 'QTUM':
        return OracleType.CENTRALISED;
      case 'BOT':
      default:
        return OracleType.DECENTRALISED;
    }
  }

  /**
 * Get Bet or Vote names and balances from oracle
 * @param  {object} oracle Oracle object
 * @return {array}         {name, value, percent}
 */
  static getBetOrVoteArray(oracle) {
    const totalBalance = _.sum(oracle.amounts);

    if (OraclePage.getOracleType(oracle) === OracleType.CENTRALISED) {
      return _.map(oracle.options, (optionName, index) => ({
        name: optionName,
        value: `${oracle.amounts[index]} ${oracle.token}`,
        percent: _.floor((oracle.amounts[index] / totalBalance) * 100),
      }));
    }

    return _.map(oracle.optionIdxs, (optIndex, index) => ({
      name: oracle.options[optIndex],
      value: `${oracle.amounts[index]} ${oracle.token}`,
      percent: _.floor((oracle.amounts[index] / totalBalance) * 100),
    }));
  }

  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      oracle: undefined,
      radioValue: DEFAULT_RADIO_VALUE, // Selected index of optionsIdx[]
    };

    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onBet = this.onBet.bind(this);
    this.onSetResult = this.onSetResult.bind(this);
    this.onFinalizeResult = this.onFinalizeResult.bind(this);
  }

  componentWillMount() {
    this.props.onGetOracles();
  }

  componentWillReceiveProps(nextProps) {
    const { getOraclesSuccess } = nextProps;

    if (!_.isEmpty(getOraclesSuccess)) {
      const oracle = _.find(getOraclesSuccess, { address: this.state.address });

      this.setState({ oracle });
      // let oracle = undefined;

      // // Determine current phase of this topic
      // if(topic.oracles.length === 1)
      // {
      //   // Centralised oracle
      //   oracle = topic.oracles[0];
      // }
      // else if(topic.oracles.length >1)
      // {
      //   // Decentralised oracle
      //   oracle = _.last(topic.oracles);
      // }
      // else if( topic.resultIdx !== -1){
      //   // Finished oracles
      //  oracle = _.last();
      // }
      // else{

      //   // default phase - oracles empty
      //   // Display something on page
      //   console.log(`Oracle is empty.`);
      // }

      // const lastOracle = _.last(topic.oracles);

      // if (lastOracle) {
      //   console.log('Found oracle', lastOracle);

      //   this.setState({
      //     oracle: lastOracle,
      //   });
      // } else {
      //   console.log('topic not load yet');
      // }
    } else {
      console.log('getOraclesSuccess is empty');
    }

    console.log(`setResultReturn: ${this.props.setResultReturn}`);
    console.log(`finalizeResultReturn: ${this.props.finalizeResultReturn}`);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');

    this.props.onClearBetReturn();
  }

  onRadioGroupChange(evt) {
    console.log(`Radio value change ${evt.target.value}`);

    this.setState({
      radioValue: evt.target.value,
    });
  }

  /** Confirm button on click handler passed down to CardVoting */
  onBet(obj) {
    const { oracle, radioValue } = this.state;

    const { walletAddrs, walletAddrsIndex } = this.props;

    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const { amount } = obj;

    const senderAddress = walletAddrs[walletAddrsIndex].address;

    const contractAddress = 'fe99572f3f4fbd3ad266f2578726b24bd0583396';
    console.log(`contractAddress is ${contractAddress}, selectedIndex is ${selectedIndex}, amount is ${amount}, senderAddress is ${senderAddress}`);

    this.props.onBet(contractAddress, selectedIndex, amount, senderAddress);
  }

  onSetResult() {
    const { oracle, radioValue } = this.state;
    const { walletAddrs, walletAddrsIndex } = this.props;

    const contractAddress = '9697b1f2701ca9434132723ee790d1cb0ab0e414';
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';
    console.log(`contractAddress is ${contractAddress}, selectedIndex is ${selectedIndex}, senderAddress is ${senderAddress}`);

    this.props.onSetResult(contractAddress, selectedIndex, senderAddress);
  }

  onFinalizeResult() {
    const { walletAddrs, walletAddrsIndex } = this.props;

    const contractAddress = '9697b1f2701ca9434132723ee790d1cb0ab0e414';
    const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';
    console.log(`contractAddress is ${contractAddress}, senderAddress is ${senderAddress}`);

    this.props.onFinalizeResult(contractAddress, senderAddress);
  }

  render() {
    const { editingToggled, betReturn } = this.props;
    const { oracle } = this.state;

    if (!oracle) {
      // TODO: render no result page
      return <div></div>;
    }

    const timeline = [{
      label: 'Prediction start block',
      value: oracle.blockNum,
    }, {
      label: 'Prediction end block',
      value: oracle.endBlock,
    }];

    const totalBalance = _.sum(oracle.amounts);
    const { token } = oracle;

    const betBalance = OraclePage.getBetOrVoteArray(oracle);

    const breadcrumbItem = (OraclePage.getOracleType(oracle) === OracleType.CENTRALISED ? 'Betting' : 'Voting');

    const oracleElement = (
      <Row
        gutter={28}
        justify="center"
      >

        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px" >
            <CardInfo
              title={oracle.name}
              timeline={timeline}
            >
            </CardInfo>
          </IsoWidgetsWrapper>

        </Col>
        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px">
            <CardVoting
              amount={totalBalance}
              token={token}
              voteBalance={betBalance}
              onSubmit={this.onBet}
              radioIndex={this.state.radioValue}
              result={betReturn}
            >
              {editingToggled
                ?
                (
                  <RadioGroup
                    onChange={this.onRadioGroupChange}
                    value={this.state.radioValue}
                    size="large"
                    defaultValue={DEFAULT_RADIO_VALUE}
                  >
                    {betBalance.map((entry, index) => (
                      <Radio value={index + 1} key={entry.name}>
                        <ProgressBar
                          label={entry.name}
                          value={entry.value}
                          percent={entry.percent}
                          barHeight={12}
                          info
                        />
                      </Radio>))
                    }
                  </RadioGroup>
                )
                :
                betBalance.map((entry) => (
                  <ProgressBar
                    key={entry.name}
                    label={entry.name}
                    value={entry.value}
                    percent={entry.percent}
                    barHeight={12}
                    info
                    marginBottom={18}
                  />))
              }
            </CardVoting>
          </IsoWidgetsWrapper>
        </Col>

      </Row>);

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumbItem}</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {oracleElement}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

OraclePage.propTypes = {
  onGetOracles: PropTypes.func,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  // getOraclesError: PropTypes.string,
  editingToggled: PropTypes.bool,
  match: PropTypes.object,
  onBet: PropTypes.func,
  betReturn: PropTypes.object,
  onClearBetReturn: PropTypes.func,
  onSetResult: PropTypes.func,
  setResultReturn: PropTypes.object,
  onFinalizeResult: PropTypes.func,
  finalizeResultReturn: PropTypes.object,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
};

OraclePage.defaultProps = {
  onGetOracles: undefined,
  getOraclesSuccess: [],
  // getOraclesError: '',
  editingToggled: false,
  match: {},
  onBet: undefined,
  onClearBetReturn: undefined,
  betReturn: undefined,
  onSetResult: undefined,
  setResultReturn: undefined,
  onFinalizeResult: undefined,
  finalizeResultReturn: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
};

const mapStateToProps = (state) => ({
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  // getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  editingToggled: state.Topic.get('toggled'),
  betReturn: state.Topic.get('bet_return'),
  setResultReturn: state.Topic.get('set_result_return'),
  finalizeResultReturn: state.Topic.get('finalize_result_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
    onBet: (contractAddress, index, amount, senderAddress) =>
      dispatch(topicActions.onBet(contractAddress, index, amount, senderAddress)),
    onClearBetReturn: () => dispatch(topicActions.onClearBetReturn()),
    onSetResult: (contractAddress, resultIndex, senderAddress) =>
      dispatch(topicActions.onSetResult(contractAddress, resultIndex, senderAddress)),
    onFinalizeResult: (contractAddress, senderAddress) =>
      dispatch(topicActions.onFinalizeResult(contractAddress, senderAddress)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OraclePage);