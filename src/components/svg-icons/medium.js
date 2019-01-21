import React from 'react';
import PropTypes from 'prop-types';

const MediumIcon = ({
  width, height, viewBox, style, fill, className,
}) => (<svg
  version="1.1"
  viewBox="-2 -2 26 26"
  width={width}
  height={height}
  style={style}
  xmlns="http://www.w3.org/2000/svg"
  className={className}
>
  <g>
    <polygon points="24,2.5 24,2 17.5,2 12.5,14 7.5,2 0,2 0,2.5 2,5.9545288 2,18 0,21.5 0,22 7,22 7,21.5 4.5,18 4.5,10.2727661 11,21.5 11.5,21.5 17,7.75 17,19 15,21.5 15,22 24,22 24,21.5 22,19 22,4.5  " />
    <polygon points="24,2.5 24,2 17.5,2 12.5,14 7.5,2 0,2 0,2.5 2,5.9545288 2,18 0,21.5 0,22 7,22 7,21.5 4.5,18 4.5,10.2727661 11,21.5 11.5,21.5 17,7.75 17,19 15,21.5 15,22 24,22 24,21.5 22,19 22,4.5  " />
  </g>
</svg>);

MediumIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  style: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
};

MediumIcon.defaultProps = {
  width: undefined,
  height: undefined,
  viewBox: undefined,
  style: undefined,
  fill: undefined,
  className: undefined,
};

export default MediumIcon;
