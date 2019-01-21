import React from 'react';
import PropTypes from 'prop-types';

const MailIcon = ({
  width, height, viewBox, style, fill, className,
}) => (<svg
  version="1.1"
  viewBox="0 -8 40 40"
  width={width}
  height={height}
  style={style}
  xmlns="http://www.w3.org/2000/svg"
  className={className}
>
  <g >
    <path d="M19,15.4615385 L36.3076923,0.461538462 L1.69230769,0.461538462 L19,15.4615385 Z M14.3251765,13.8010536 L19,17.6382399 L23.6015813,13.8010536 L36.3076923,24.6923077 L1.69230769,24.6923077 L14.3251765,13.8010536 Z M0.538461538,23.5384615 L0.538461538,1.61538462 L13.2307692,12.5769231 L0.538461538,23.5384615 Z M37.4615385,23.5384615 L37.4615385,1.61538462 L24.7692308,12.5769231 L37.4615385,23.5384615 Z" />
  </g>
</svg>);

MailIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  style: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
};

MailIcon.defaultProps = {
  width: undefined,
  height: undefined,
  viewBox: undefined,
  style: undefined,
  fill: undefined,
  className: undefined,
};

export default MailIcon;
