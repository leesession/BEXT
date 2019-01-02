import React from 'react';

class ProgressBar extends React.Component {
  render() {
    return (<div className="progress">
      <div className="progress-bar" style={{ width: '55%' }} >
        <span>55%</span>
      </div>
    </div>);
  }
}

export default ProgressBar;
