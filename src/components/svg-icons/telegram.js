import React from 'react';
import PropTypes from 'prop-types';

const TelegramIcon = ({
  width, height, viewBox, style, fill, className,
}) => (<svg
  version="1.1"
  viewBox="0 0 30.2 30.1"
  width={width}
  height={height}
  style={style}
  xmlns="http://www.w3.org/2000/svg"
  className={className}

>
  <g fill={fill}>
    <path className="st0" d="M2.1,14.6C8.9,12,28.5,4,28.5,4l-3.9,22.6c-0.2,1.1-1.5,1.5-2.3,0.8l-6.1-5.1l-4.3,4l0.7-6.7l13-12.3l-16,10  l1,5.7l-3.3-5.3l-5-1.6C1.5,15.8,1.4,14.8,2.1,14.6z" />
  </g>
</svg>);

TelegramIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  style: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
};

TelegramIcon.defaultProps = {
  width: undefined,
  height: undefined,
  viewBox: undefined,
  style: undefined,
  fill: undefined,
  className: undefined,
};


export default TelegramIcon;
