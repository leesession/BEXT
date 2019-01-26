/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7',
];

const getUsernameColor = (username) => {
  if (_.isUndefined(username)) {
    return COLORS[0];
  }

  // Compute hash code
  let hash = 7;
  for (let i = 0; i < username.length; i++) {
    hash = (username.charCodeAt(i) + (hash << 5)) - hash;
  }
  // Calculate color
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};


class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { message } = this.props;

    if (message.type === 'system') {
      return <li className={message.type} ><span className="body">{message.body}</span></li>;
    }

    return (<li className={message.type} ><span className="username" >{message.username}</span>
      <span className="body">{message.body}</span></li>);
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
};

Message.defaultProps = {
};

export default Message;
