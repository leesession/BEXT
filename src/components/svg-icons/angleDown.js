import React from 'react';
import PropTypes from 'prop-types';

const AngleDownIcon = ({
  width, height, viewBox, style, fill, className,
}) => (<svg
  version="1.1"
  viewBox="0 0 1792 1792"
  width={width}
  height={height}
  style={style}
  xmlns="http://www.w3.org/2000/svg"
  className={className}
>
  <path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z" />
</svg >);

AngleDownIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  style: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
};

AngleDownIcon.defaultProps = {
  width: undefined,
  height: undefined,
  viewBox: undefined,
  style: undefined,
  fill: undefined,
  className: undefined,
};

export default AngleDownIcon;
