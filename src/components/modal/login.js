/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import IntlMessages from '../utility/intlMessages';
import appActions from '../../redux/app/actions';
import Modal from '../uielements/modal';
import Button from '../uielements/button';
import Input from '../uielements/input';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };

    this.onLoginClicked = this.onLoginClicked.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onLoginClicked() {
    const { login } = this.props;
    const { inputValue } = this.state;

    login(inputValue);
  }

  onInputChange(evt) {
    const { value } = evt.target;

    this.setState({
      inputValue: value,
    });
  }

  render() {
    const { inputValue } = this.state;
    const {
      intl, setVisibility, isVisible, view,
    } = this.props;

    const descriptions = intl.formatMessage({ id: 'modal.fair.description' }).split('\n');

    const btnWidth = view === 'MobileView' ? 120 : 180;
    const btnHeight = view === 'MobileView' ? 40 : 48;

    const text = _.map(descriptions, (part, partIndex) => <p key={partIndex}>{part}</p>);
    return (
      <Modal
        className="modal-login"
        visible={isVisible}
        title={intl.formatMessage({ id: 'modal.login.keychain' })}
        onOk={() => setVisibility(false)}
        onCancel={() => { setVisibility(false); }}
      >
        <div className="form-control">
          <Input
            type="text"
            name="account"
            placeholder="Steem Account"
            value={this.state.inputValue}
            onChange={this.onInputChange}
          />
        </div>
        <div className="form-control centered">
          <Button type="submit" width={btnWidth} height={btnHeight} onClick={this.onLoginClicked}><IntlMessages id="modal.login.button" /></Button>
        </div>
      </Modal>);
  }
}

LoginModal.propTypes = {
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool,
  setVisibility: PropTypes.func,
  login: PropTypes.func,
  view: PropTypes.string,
};

LoginModal.defaultProps = {
  login: undefined,
  isVisible: false,
  setVisibility: undefined,
  view: 'MobileView',
};

const mapStateToProps = (state) => ({
  isVisible: state.App.get('loginModalVisible'),
});

const mapDispatchToProps = (dispatch) => ({
  setVisibility: (value) => dispatch(appActions.setLoginModalVisibility(value)),
  login: (username) => dispatch(appActions.login(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LoginModal));
