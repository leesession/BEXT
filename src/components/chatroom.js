
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import chatActions from '../redux/chat/actions';
import Message from './message';
import IntlMessages from '../components/utility/intlMessages';

const {
  initSocketConnection, sendMessage, fetchChatHistory, clearMessage,
} = chatActions;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEnabled: true, // Switch to turn and off chat input and sendMessageReq function; value not changed by any code
      historyArray: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { fetchChatHistoryReq } = this.props;
    fetchChatHistoryReq();
  }

  componentDidMount() {
    const { initSocketConnectionReq } = this.props;
    initSocketConnectionReq({ collection: 'Message' });
  }

  componentDidUpdate() {
    this.myRef.scrollTop = this.myRef.scrollHeight;
  }

  componentWillReceiveProps(nextProps) {
    const { history } = nextProps;

    const fieldsToUpdate = {};

    // Construct historyArray elements in reverse order to make sure the most recent is at the bottom
    if (!_.isEmpty(history)) {
      const historyArray = [];

      for (let i = history.length - 1; i >= 0; i -= 1) {
        const messageObj = history[i];
        historyArray.push(<Message message={messageObj} key={messageObj.id || i} />);
      }

      fieldsToUpdate.historyArray = historyArray;
    }

    this.setState(fieldsToUpdate);
  }

  componentWillUnmount() {
    const { clearMessageHistoryReq } = this.props;
    clearMessageHistoryReq();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const { sendMessageReq, username, intl } = this.props;
    const { value, isEnabled } = this.state;

    event.preventDefault();

    if (isEnabled) {
    // Return is input string is empty
      if (value === '' || _.trim(value) === '') {
        message.warn(intl.formatMessage({ id: 'message.warn.emptyInput' }));
        this.setState({
          value: '',
        });
        return;
      }

      sendMessageReq({
        username,
        body: value,
      });

      this.setState({
        value: '',
      });
    } else {
      message.warn(intl.formatMessage({ id: 'message.warn.chatDisabled' }));
    }
  }

  render() {
    const {
      refresh, intl,
    } = this.props;
    const { value, isEnabled, historyArray } = this.state;

    return (
      <div id="chatroom">
        <div className="chatroom-message-container">
          <ul ref={(ele) => { this.myRef = ele; }}>
            {historyArray}
          </ul>
        </div>
        <form className="form" onSubmit={this.handleSubmit}>
          <Row type="flex" justify="end">
            <Col span={16}>
              <Input type="text" placeholder={intl.formatMessage({ id: 'chatroom.input.placeholder' })} onChange={this.handleChange} value={value} disabled={!isEnabled} />
            </Col>
            <Col span={6}>
              <Button type="default" htmlType="submit" size="large"><IntlMessages id="dice.send" /></Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

ChatRoom.propTypes = {
  history: PropTypes.array,
  initSocketConnectionReq: PropTypes.func,
  sendMessageReq: PropTypes.func,
  clearMessageHistoryReq: PropTypes.func,
  refresh: PropTypes.bool,
  fetchChatHistoryReq: PropTypes.func,
  username: PropTypes.string,
  intl: intlShape.isRequired,
};

ChatRoom.defaultProps = {
  history: undefined,
  initSocketConnectionReq: undefined,
  sendMessageReq: undefined,
  refresh: undefined,
  fetchChatHistoryReq: undefined,
  username: undefined,
  clearMessageHistoryReq: undefined,
};

const mapStateToProps = (state) => ({
  history: state.Chat.get('history'),
  refresh: state.Chat.get('refresh'),
});

const mapDispatchToProps = (dispatch) => ({
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  sendMessageReq: (obj) => dispatch(sendMessage(obj)),
  fetchChatHistoryReq: () => dispatch(fetchChatHistory()),
  clearMessageHistoryReq: () => dispatch(clearMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ChatRoom));

