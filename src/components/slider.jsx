import { Slider, InputNumber, Row, Col } from 'antd';
import React, { PropTypes } from 'react';

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
          <Col span={16}>
            <Slider
              min={min}
              max={max}
              onChange={this.onChange}
              value={typeof inputValue === 'number' ? inputValue : 0}
              tipFormatter={null}
            />
          </Col>
          <Col span={8}>
            <InputNumber
              min={min}
              max={max}
              style={{ width: '100%', height: '40px' }}
              value={inputValue}
              onChange={this.onChange}
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
