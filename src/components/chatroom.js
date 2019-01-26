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

  componentWillUnmount() {
    const { clearMessageHistoryReq } = this.props;
    clearMessageHistoryReq();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const { sendMessageReq, username, intl } = this.props;
    const { value } = this.state;

    event.preventDefault();

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
  }

  render() {
    const {
      history, messageNum, refresh, intl,
    } = this.props;
    const { value } = this.state;

    return (
      <div id="chatroom">
        {/* <Row>
          <Col span={24}>
          聊天室
          </Col>
          <Col span={10} offset={14}>
          <Button>English</Button>
          </Col>
        </Row> */}
        <div className="chatroom-message-container">
          <ul ref={(ele) => { this.myRef = ele; }}>
            {
              !_.isEmpty(history.all()) &&
              _.map(history.all(), (messageObj, index) =>
                <Message message={messageObj} key={messageObj.id || index} />)
            }
          </ul>
        </div>
        <form className="form" onSubmit={this.handleSubmit}>
          <Row type="flex" justify="end">
            <Col span={16}>
              <Input type="text" placeholder={intl.formatMessage({ id: 'chatroom.input.placeholder' })} onChange={this.handleChange} value={value} />
            </Col>
            <Col span={6}>
              <Button type="default" htmlType="submit" size="large"><IntlMessages id="dice.send" /></Button>
            </Col>
          </Row>
          {/* <div className="info"><span>{messageNum} messages, refresh: {refresh}</span></div> */}
        </form>
      </div>
    );
  }
}

ChatRoom.propTypes = {
  history: PropTypes.object,
  messageNum: PropTypes.number,
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
  messageNum: 0,
  initSocketConnectionReq: undefined,
  sendMessageReq: undefined,
  refresh: undefined,
  fetchChatHistoryReq: undefined,
  username: undefined,
  clearMessageHistoryReq: undefined,
};

const mapStateToProps = (state) => ({
  history: state.Chat.get('history'),
  messageNum: state.Chat.get('messageNum'),
  refresh: state.Chat.get('refresh'),
});

const mapDispatchToProps = (dispatch) => ({
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  sendMessageReq: (obj) => dispatch(sendMessage(obj)),
  fetchChatHistoryReq: () => dispatch(fetchChatHistory()),
  clearMessageHistoryReq: () => dispatch(clearMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ChatRoom));

