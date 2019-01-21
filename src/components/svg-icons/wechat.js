import React from 'react';
import PropTypes from 'prop-types';

const WechatIcon = ({
  width, height, viewBox, style, fill, className,
}) => (<svg
  version="1.1"
  viewBox="0 -2 24 24"
  width={width}
  height={height}
  style={style}
  xmlns="http://www.w3.org/2000/svg"
  className={className}
>
  <g fill={fill} >
    <path d="M16.5,8V8l.15,0h0a.55.55,0,0,0,.51-.5.5.5,0,0,0-.09-.29C15.92,4.09,12.59,2,8.75,2,3.93,2,0,5.36,0,9.5a7.06,7.06,0,0,0,3.09,5.71l-1,2.07a.5.5,0,0,0,.7.66l2.65-1.51a10,10,0,0,0,2.22.51.5.5,0,0,0,.54-.61A5.8,5.8,0,0,1,8,15C8,11.14,11.81,8,16.5,8ZM11,6a1,1,0,1,1-1,1A1,1,0,0,1,11,6ZM6,8A1,1,0,1,1,7,7,1,1,0,0,1,6,8Z" />
    <path d="M24,15c0-3.31-3.36-6-7.5-6S9,11.69,9,15s3.36,6,7.5,6a9.23,9.23,0,0,0,2.3-.29l2.48,1.24a.5.5,0,0,0,.22.05.5.5,0,0,0,.46-.69l-.68-1.7A5.64,5.64,0,0,0,24,15ZM14,14a1,1,0,1,1,1-1A1,1,0,0,1,14,14Zm5,0a1,1,0,1,1,1-1A1,1,0,0,1,19,14Z" />
  </g>
</svg>);

WechatIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  style: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
};

WechatIcon.defaultProps = {
  width: undefined,
  height: undefined,
  viewBox: undefined,
  style: undefined,
  fill: undefined,
  className: undefined,
};

export default WechatIcon;
