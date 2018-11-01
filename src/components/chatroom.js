import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import chatActions from '../redux/chat/actions';
import Message from './message';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

const { initSocketConnection, sendMessage } = chatActions;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.username = `Guest-${_.random(100000, 999999, false)}`;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { initSocketConnectionReq } = this.props;
    initSocketConnectionReq({ collection: 'Message' });
  }

  componentDidUpdate() {
    this.myRef.scrollTop = this.myRef.scrollHeight;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const { sendMessageReq } = this.props;
    const { value } = this.state;

    console.log('sending message', value);
    event.preventDefault();

    sendMessageReq({
      username: this.username,
      body: value,
    });

    this.setState({
      value: '',
    });
  }


  render() {
    const { history, messageNum, refresh } = this.props;
    const { value } = this.state;

    const leftSpan = 20;
    const rightSpan = 24 - leftSpan;

    return (
      <div id="chatroom">
        <ul ref={(ele) => { this.myRef = ele; }}>
          {
            !_.isEmpty(history.all()) &&
            _.map(history.all(), (message) =>
              <Message message={message} key={message.id || (message.type + message.body)} />)
          }
        </ul>
        <form className="form" onSubmit={this.handleSubmit}>
          <Row gutter={20}>
            <Col span={leftSpan}>
              <Input type="text" placeholder="Type something here" onChange={this.handleChange} value={value} />
            </Col>
            <Col span={rightSpan}>
              <Button type="default" htmlType="submit" size="large">Send</Button>
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
  refresh: PropTypes.bool,
};

ChatRoom.defaultProps = {
  history: undefined,
  messageNum: 0,
  initSocketConnectionReq: undefined,
  sendMessageReq: undefined,
  refresh: undefined,
};

const mapStateToProps = (state) => ({
  history: state.Chat.get('history'),
  messageNum: state.Chat.get('messageNum'),
  refresh: state.Chat.get('refresh'),
});

const mapDispatchToProps = (dispatch) => ({
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  sendMessageReq: (obj) => dispatch(sendMessage(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);

