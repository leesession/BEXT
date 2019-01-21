import React from 'react';
import PropTypes from 'prop-types';

import Mail from './mail';
import Medium from './medium';
import Twitter from './twitter';
import Wechat from './wechat';
import Telegram from './telegram';

const SvgIcon = (props) => {
  const {
    name, ...rest
  } = props;

  rest.className = rest.className ? `svgicon ${rest.className}` : 'svgicon';

  switch (name) {
    case 'mail':
      return <Mail {...rest} />;
    case 'medium':
      return <Medium {...rest} />;
    case 'twitter':
      return <Twitter {...rest} />;
    case 'wechat':
      return <Wechat {...rest} />;
    case 'telegram':
      return <Telegram {...rest} />;
    default:
      return <Mail {...rest} />;
  }
};

// SvgIcon.propTypes = {
//   name: PropTypes.string,
// };

// SvgIcon.defaultProps = {
//   name: undefined,
// };

export default SvgIcon;
