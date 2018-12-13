/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Layout, Menu, message, Button, Modal } from 'antd';

import IntlMessages from '../components/utility/intlMessages';
import appActions from '../redux/app/actions';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.isVisible,
    };

    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isVisible } = nextProps;
    const { visible } = this.state;

    if (!_.isUndefined(isVisible)) {
      this.setState({
        visible: isVisible,
      });
    }
  }

  onLoginClicked() {
    const { getIdentity } = this.props;

    getIdentity();
  }

  render() {
    const { visible } = this.state;

    return (<Modal
      className="refModal loginModal"
      title={<IntlMessages id="modal.login.title" />}
      centered
      visible={visible}
      onOk={() => this.props.closeModal(false)}
      onCancel={() => {
        this.props.closeModal(false);
      }}
      footer={null}
    >
      <div className="refmodal-container">
        <div className="refmodal-container-description">
          <p><IntlMessages id="modal.login.description" /></p>
        </div>
        <div className="refmodal-container-button">
          <Button type="primary" size="large" onClick={this.onLoginClicked}><IntlMessages id="modal.login.button" /></Button>
        </div>
      </div>
    </Modal>);
  }
}

LoginModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  getIdentity: PropTypes.func,
  closeModal: PropTypes.func,
};

LoginModal.defaultProps = {
  getIdentity: undefined,
  closeModal: undefined,
};

const mapDispatchToProps = (dispatch) => ({
  getIdentity: () => dispatch(appActions.getIdentity()),
});

export default connect(null, mapDispatchToProps)(injectIntl(LoginModal));
