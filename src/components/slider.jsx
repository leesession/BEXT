import { Slider, InputNumber, Row, Col } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

class IntegerStep extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.defaultValue,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const { getValue } = this.props;
    this.setState({
      inputValue: value,
    });

    getValue(value);
  }

  render() {
    const { inputValue } = this.state;
    const { min, max, defaultValue } = this.props;
    return (
      <div className="slider">
        <Row gutter={32}>
          <Col span={24}>
            <Slider
              className='slider_self'
              min={min}
              max={max}
              onChange={this.onChange}
              value={typeof inputValue === 'number' ? inputValue : 0}
              tipFormatter={null}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

IntegerStep.propTypes = {
  getValue: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  defaultValue: PropTypes.number.isRequired,
};

IntegerStep.defaultProps = {
};


export default IntegerStep;
