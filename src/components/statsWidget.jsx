import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import IntlMessages from './utility/intlMessages';
import { appConfig } from '../settings';

function CalculateColorByPercentage(startColor, endColor, percentage) {
  const lowerBound = 60;
  const upperBound = 100;

  if (percentage < lowerBound) {
    return startColor;
  }

  // Pad a 0 to a single digit number; can be replaced by lodash function
  function padZeroLeft(input) {
    const x = input.toString(16);
    return (x.length === 1) ? `0${x}` : x;
  }

  const ratio = (upperBound - percentage) / (upperBound - lowerBound);

  const r = Math.ceil((parseInt(startColor.substring(0, 2), 16) * ratio) + (parseInt(endColor.substring(0, 2), 16) * (1 - ratio)));
  const g = Math.ceil((parseInt(startColor.substring(2, 4), 16) * ratio) + (parseInt(endColor.substring(2, 4), 16) * (1 - ratio)));
  const b = Math.ceil((parseInt(startColor.substring(4, 6), 16) * ratio) + (parseInt(endColor.substring(4, 6), 16) * (1 - ratio)));

  return padZeroLeft(r) + padZeroLeft(g) + padZeroLeft(b);
}

class StatsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.startColor = 'e6c36b'; // Gold
    this.endColor = 'e74f4b'; // Red

    this.style = {
      type: 'dashboard', strokeWidth: 12, strokeColor: this.startColor, strokeLinecap: 'round',
    };
  }

  render() {
    const { cpuUsage, netUsage, view } = this.props;
    const { startColor, endColor, style } = this;


    if (view === 'MobileView') {
      style.width = 35;
    } else {
      style.width = 45;
    }


    // Calculate gradient color based on percentage

    const cpuPercent = cpuUsage ? _.toInteger(cpuUsage * 100) : 0;
    const cpuColor = CalculateColorByPercentage(startColor, endColor, cpuPercent);
    const cpuStyle = _.cloneDeep(style);
    _.extend(cpuStyle, { strokeColor: cpuColor });

    const cpuElement = (<div className="topbar-statswidget-cpu">
      <a href={appConfig.cpuBankUrl} target="_self">
        <Progress {...cpuStyle} percent={cpuPercent} format={(percent) => `${percent}%`} />
        <div className="topbar-statswidget-title"><IntlMessages id="topbar.stats.cpu" /></div>
      </a>
    </div>);

    const netPercent = netUsage ? _.toInteger(netUsage * 100) : 0;
    const netColor = CalculateColorByPercentage(startColor, endColor, netPercent);
    const netStyle = _.cloneDeep(style);
    _.extend(netStyle, { strokeColor: netColor });

    const netElement = (<div className="topbar-statswidget-net">
      <Progress {...netStyle} percent={netPercent} format={(percent) => `${percent}%`} />
      <div className="topbar-statswidget-title">
        <IntlMessages id="topbar.stats.net" />
      </div>
    </div>);

    return (
      <div className="topbar-statswidget">
        {cpuElement}
        {netElement}
      </div>
    );
  }
}

StatsWidget.propTypes = {
  cpuUsage: PropTypes.number,
  netUsage: PropTypes.number,
  view: PropTypes.string,
};

StatsWidget.defaultProps = {
  cpuUsage: undefined,
  netUsage: undefined,
  view: undefined,
};

const mapStateToProps = (state) => ({
  cpuUsage: state.App.get('cpuUsage'),
  netUsage: state.App.get('netUsage'),
  view: state.App.get('view'),
});

// const mapDispatchToProps = (dispatch) => ({
// });

export default connect(mapStateToProps, null)(StatsWidget);

