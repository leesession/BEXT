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

    this.setModalVisibility = this.setModalVisibility.bind(this);
    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isVisible } = nextProps;

    if (!_.isUndefined(isVisible)) {
      this.setState({
        visible: isVisible,
      });
    }
  }

  setModalVisibility(value) {
    this.setState({
      visible: value,
    });
  }

  onLoginClicked() {
    const { getIdentity } = this.props;

    getIdentity();
  }

  render() {
    const { visible } = this.state;

    return (<Modal
      className="loginModal"
      title={<IntlMessages id="topbar.copy.title" />}
      centered
      visible={visible}
      onOk={() => this.setModalVisibility(false)}
      onCancel={() => {
        this.setModalVisibility(false);
      }}
      footer={null}
    >
      <div className="refmodal-container">
        <div className="refmodal-container-input">
          <div><span>abc</span></div>
          <div>
            <Button type="primary" size="large" onClicked={this.onLoginClicked}><IntlMessages id="modal.button.login" /></Button>
          </div>
        </div>
        <div>
          <span><IntlMessages id="topbar.copy.description" /></span></div>
      </div>
    </Modal>);
  }
}

LoginModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  getIdentity: PropTypes.func,
};

LoginModal.defaultProps = {
  getIdentity: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  username: state.App.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  getIdentity: () => dispatch(appActions.getIdentity()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LoginModal));
