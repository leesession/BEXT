import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import chatActions from '../redux/chat/actions';
import Message from './message';
import IntlMessages from '../components/utility/intlMessages';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

const { initSocketConnection, sendMessage, fetchChatHistory } = chatActions;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    const {fetchChatHistoryReq} = this.props;
    fetchChatHistoryReq();
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
    const { sendMessageReq, username } = this.props;
    const { value } = this.state;

    console.log('sending message', value);
    event.preventDefault();

    sendMessageReq({
      username,
      body: value,
    });

    this.setState({
      value: '',
    });
  }


  render() {
    const { history, messageNum, refresh } = this.props;
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
        <ul ref={(ele) => { this.myRef = ele; }}>
          {
            !_.isEmpty(history.all()) &&
            _.map(history.all(), (message, index) =>
              <Message message={message} key={message.id || index} />)
          }
        </ul>
        <form className="form" onSubmit={this.handleSubmit}>
          <Row gutter={20} type='flex' justify='center'>
            <Col span={16}>
              <Input type="text" placeholder="" onChange={this.handleChange} value={value} />
            </Col>
            <Col span={6}>
              <Button  type="default" htmlType="submit" style={{fontSize:'1.2em',fontWeight:800}} size="large"><IntlMessages id="dice.send" /></Button>
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
  fetchChatHistoryReq: PropTypes.func,
  username: PropTypes.string,
};

ChatRoom.defaultProps = {
  history: undefined,
  messageNum: 0,
  initSocketConnectionReq: undefined,
  sendMessageReq: undefined,
  refresh: undefined,
  fetchChatHistoryReq: undefined,
  username: undefined,
};

const mapStateToProps = (state) => ({
  history: state.Chat.get('history'),
  messageNum: state.Chat.get('messageNum'),
  refresh: state.Chat.get('refresh'),
});

const mapDispatchToProps = (dispatch) => ({
  initSocketConnectionReq: (obj) => dispatch(initSocketConnection(obj)),
  sendMessageReq: (obj) => dispatch(sendMessage(obj)),
  fetchChatHistoryReq: () =>dispatch(fetchChatHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);

