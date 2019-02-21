/* eslint no-restricted-syntax: 0 */
import cx from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';

const SliderWrapper = styled.div`
&.rangeslider {
  margin: 20px 0;
  position: relative;
  background-color: rgba(255,255,255,.2);
  cursor: pointer;
  -ms-touch-action: none;
  touch-action: none;

  &.rangeslider-horizontal {
    height: 8px;
    border-radius: 2px;
    .rangeslider__fill {
      height: 100%;
      border-radius: 2px;
      top: 0;
      background-color: #ffbc00;
      -webkit-box-shadow: 0 0 7px #ffbc00;
      box-shadow: 0 0 7px #ffbc00;
      position: relative;  
    }
    .rangeslider__handle {
      display: block;
      height: 16px;
      width: 16px;
      position: absolute;
      right: -11px;
      top: -5px;
      background-color: #f4f4f4;
      border-radius: 4px;
      -webkit-box-shadow: 0 0 5px #fff;
      box-shadow: 0 0 5px #fff;
      cursor: -webkit-grabbing;
      cursor: grabbing;
      z-index: 2;
    }
    .rangeslider__handle-tooltip {
      top: -35px;
      &:after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid rgba(0, 0, 0, 0.8);
        left: 50%;
        bottom: -8px;
        transform: translate3d(-50%, 0, 0);
      }
    }
  }
  
  .rangeslider__handle {
    background: #fff;
    border: 1px solid #ccc;
    cursor: pointer;
    display: inline-block;
    position: absolute;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 -1px 3px rgba(0, 0, 0, 0.4);
    .rangeslider__active {
      opacity: 1;
    }
  }

  .rangeslider__handle-tooltip {
    width: 40px;
    height: 24px;
    text-align: center;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    font-weight: normal;
    font-size: 14px;
    transition: all 100ms ease-in;
    border-radius: 4px;
    display: inline-block;
    color: white;
    left: 50%;
    transform: translate(-50%, 0);
    span {
      margin-top: 6px;
      display: inline-block;
      line-height: 100%;
    }
    &:after {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
    }
  }
  
  .rangeslider__labels {
    position: relative;
    .rangeslider__label-item {
      position: absolute;
      top: 5px;
      right: -18px;
      height: 28px;
      width: 32px;
      line-height: 26px;
      border-radius: 4px;
      background-color: none;
      font-size: 1.3em;
      font-weight: 600;
      border: 2px solid #ffbc00;
      color: #ffbc00;
      text-align: center;
      
      &.rangeslider__label-item-dark{
        border-color: rgba(255,255,255, .2);
        color: rgba(255,255,255, .2);

        &:before {
          border-bottom-color: rgba(255,255,255, .2);
        }
      }

      &::before {
        content: "";
        display: block;
        position: absolute;
        height: 0px;
        width: 0px;
        border: 6px solid transparent;
        border-bottom-color: #ffbc00;
        top: -14px;
        left: 8px;
      }
    }
  }
}
`;

/**
 * Predefined constants
 * @type {Object}
 */
const constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      reverseDirection: 'right',
      coordinate: 'x',
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      reverseDirection: 'bottom',
      coordinate: 'y',
    },
  },
};

/**
 * Capitalize first letter of string
 * @private
 * @param  {string} - String
 * @return {string} - String with first letter capitalized
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

/**
     * Clamp position between a range
     * @param  {number} - Value to be clamped
     * @param  {number} - Minimum value in range
     * @param  {number} - Maximum value in range
     * @return {number} - Clamped value
     */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

class Slider extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    start: PropTypes.number,
    end: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    orientation: PropTypes.string,
    tooltip: PropTypes.bool,
    reverse: PropTypes.bool,
    labels: PropTypes.object,
    handleLabel: PropTypes.string,
    className: PropTypes.string,
    format: PropTypes.func,
    onChangeStart: PropTypes.func,
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
  };

  static defaultProps = {
    min: 1,
    max: 100,
    start: 2,
    end: 96,
    step: 1,
    value: 50,
    orientation: 'horizontal',
    tooltip: true,
    reverse: false,
    labels: {},
    handleLabel: '',
    className: '',
    format: undefined,
    onChangeStart: undefined,
    onChange: undefined,
    onChangeComplete: undefined,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      active: false,
      limit: 0,
      grab: 0,
    };
  }

  componentDidMount() {
    this.handleUpdate();
    const resizeObserver = new ResizeObserver(this.handleUpdate);
    resizeObserver.observe(this.slider);
  }

  /**
   * Format label/tooltip value
   * @param  {Number} - value
   * @return {Formatted Number}
   */
  handleFormat = (value) => {
    const { format } = this.props;
    return format ? format(value) : value;
  };

  /**
   * Update slider state on change
   * @return {void}
   */
  handleUpdate = () => {
    if (!this.slider) {
      // for shallow rendering
      return;
    }
    const { orientation } = this.props;
    const dimension = capitalize(constants.orientation[orientation].dimension);
    const sliderPos = this.slider[`offset${dimension}`];
    const handlePos = this.handle[`offset${dimension}`];

    this.setState({
      limit: sliderPos - (handlePos * 2),
      grab: handlePos / 2,
    });
  };

  /**
   * Attach event listeners to mousemove/mouseup events
   * @return {void}
   */
  handleStart = (e) => {
    const { onChangeStart } = this.props;
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);
    this.setState(
      {
        active: true,
      },
      () => {
        if (onChangeStart) {
          onChangeStart(e);
        }
      }
    );
  };

  /**
   * Handle drag/mousemove event
   * @param  {Object} e - Event object
   * @return {void}
   */
  handleDrag = (e) => {
    e.preventDefault();
    const { onChange, start, end } = this.props;
    const { target: { className, classList, dataset } } = e;
    if (!onChange || className === 'rangeslider__labels') return;

    let value = this.position(e);

    if (
      classList &&
      classList.contains('rangeslider__label-item') &&
      dataset.value
    ) {
      value = parseFloat(dataset.value);
    }

    if (onChange) {
      const newValue = _.clamp(value, start, end);
      onChange(newValue, e);
    }
  };

  /**
   * Detach event listeners to mousemove/mouseup events
   * @return {void}
   */
  handleEnd = (e) => {
    const { onChangeComplete } = this.props;
    this.setState(
      {
        active: false,
      },
      () => {
        if (onChangeComplete) {
          onChangeComplete(e);
        }
      }
    );
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleEnd);
  };

  /**
   * Support for key events on the slider handle
   * @param  {Object} e - Event object
   * @return {void}
   */
  handleKeyDown = (e) => {
    e.preventDefault();
    const { keyCode } = e;
    const {
      value, start, end, step, onChange,
    } = this.props;
    let sliderValue;

    switch (keyCode) {
      case 38:
      case 39:
        sliderValue = value + step > end ? end : value + step;

        if (onChange) {
          onChange(sliderValue, e);
        }

        break;
      case 37:
      case 40:
        sliderValue = value - step < start ? start : value - step;
        if (onChange) {
          onChange(sliderValue, e);
        }
        break;
      default:
    }
  };

  /**
   * Calculate position of slider based on its value
   * @param  {number} value - Current value of slider
   * @return {position} pos - Calculated position of slider based on value
   */
  getPositionFromValue = (value) => {
    const { limit } = this.state;
    const { min, max } = this.props;
    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * limit);

    return pos;
  };

  getLabelPositionFromValue = (value) => {
    const { limit: stateLimit, grab } = this.state;

    const limit = stateLimit + (grab * 4);

    const { min, max } = this.props;
    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * limit);

    return pos;
  };

  /**
   * Translate position of slider to slider value
   * @param  {number} pos - Current position/coordinates of slider
   * @return {number} value - Slider value
   */
  getValueFromPosition = (pos) => {
    const { limit } = this.state;
    const {
      orientation, min, max, step,
    } = this.props;
    const percentage = clamp(pos, 0, limit) / (limit || 1);
    const baseVal = step * Math.round((percentage * (max - min)) / step);
    const value = orientation === 'horizontal' ? baseVal + min : max - baseVal;

    return clamp(value, min, max);
  };

  /**
   * Calculate position of slider based on value
   * @param  {Object} e - Event object
   * @return {number} value - Slider value
   */
  position(e) {
    const { grab } = this.state;
    const { orientation, reverse } = this.props;

    const node = this.slider;
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = reverse
      ? constants.orientation[orientation].reverseDirection
      : constants.orientation[orientation].direction;
    const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
    const coordinate = !e.touches
      ? e[clientCoordinateStyle]
      : e.touches[0][clientCoordinateStyle];
    const direction = node.getBoundingClientRect()[directionStyle];
    const pos = reverse
      ? direction - coordinate - grab
      : coordinate - direction - grab;
    const value = this.getValueFromPosition(pos);

    return value;
  }

  /**
   * Grab coordinates of slider
   * @param  {Object} pos - Position object
   * @return {Object} - Slider fill/handle coordinates
   */
  coordinates(pos) {
    const { limit, grab } = this.state;
    const { orientation } = this.props;
    const value = this.getValueFromPosition(pos);
    const position = this.getPositionFromValue(value);
    const handlePos = orientation === 'horizontal' ? position + grab : position;
    const labelPos = position;
    const fillPos = orientation === 'horizontal'
      ? handlePos
      : limit - handlePos;

    return {
      fill: fillPos,
      handle: handlePos,
      label: labelPos,
    };
  }

  renderLabels = (labels) => (
    <ul
      ref={(sl) => {
        this.labels = sl;
      }}
      className="rangeslider__labels"
    >
      {labels}
    </ul>
  );

  render() {
    const {
      value,
      orientation,
      className,
      tooltip,
      reverse,
      labels,
      min,
      max,
      handleLabel,
    } = this.props;
    const { active } = this.state;
    const { dimension } = constants.orientation[orientation];
    const direction = reverse
      ? constants.orientation[orientation].reverseDirection
      : constants.orientation[orientation].direction;
    const position = this.getPositionFromValue(value);
    const coords = this.coordinates(position);
    const fillStyle = { [dimension]: `${coords.fill}px` };
    const handleStyle = { [direction]: `${coords.handle}px` }; // handle width is 22px

    const labelItems = [];
    let labelKeys = Object.keys(labels);

    if (labelKeys.length > 0) {
      labelKeys = labelKeys.sort((a, b) => (reverse ? a - b : b - a));

      for (const key of labelKeys) {
        const labelPosition = this.getPositionFromValue(key);
        const labelCoords = this.coordinates(labelPosition);
        const labelStyle = { [direction]: `${labelCoords.label}px` };

        labelItems.push(<li
          key={key}
          className={cx(
            'rangeslider__label-item',
            { 'rangeslider__label-item-dark': labels[key] >= value },
          )}
          data-value={key}
          onMouseDown={this.handleDrag}
          onTouchStart={this.handleStart}
          onTouchEnd={this.handleEnd}
          style={labelStyle}
        >
          {this.props.labels[key]}
        </li>);
      }
    }

    return (
      <SliderWrapper
        ref={(s) => {
          this.slider = s;
        }}
        className={cx(
          'rangeslider',
          `rangeslider-${orientation}`,
          { 'rangeslider-reverse': reverse },
          className
        )}
        onMouseDown={this.handleDrag}
        onMouseUp={this.handleEnd}
        onTouchStart={this.handleStart}
        onTouchEnd={this.handleEnd}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-orientation={orientation}
      >
        <div className="rangeslider__fill" style={fillStyle} />
        <div
          ref={(sh) => {
            this.handle = sh;
          }}
          className="rangeslider__handle"
          onMouseDown={this.handleStart}
          onTouchMove={this.handleDrag}
          onTouchEnd={this.handleEnd}
          onKeyDown={this.handleKeyDown}
          style={handleStyle}
        >
          <div
            ref={(st) => {
              this.tooltip = st;
            }}
            className="rangeslider__handle-tooltip"
          >
            <span>{this.handleFormat(value)}</span>
          </div>

          <div className="rangeslider__handle-label">{handleLabel}</div>
        </div>
        {labels ? this.renderLabels(labelItems) : null}
      </SliderWrapper>
    );
  }
}

export default Slider;
