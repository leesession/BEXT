import React from 'react';

import PropTypes from 'prop-types';
import IntlMessages from '../utility/intlMessages';
import Modal from '../uielements/modal';
import Button from '../uielements/button';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      setVisibility, isVisible, view, onClose, title, onOk,
    } = this.props;

    const btnWidth = view === 'MobileView' ? 120 : 180;
    const btnHeight = view === 'MobileView' ? 40 : 48;

    return (
      <Modal
        className="modal-login"
        isVisible={isVisible}
        setVisibility={setVisibility}
        onClose={onClose}
        title={title}
      >
        <div>
          <div className="modal-main-margin-bottom">
            <p><IntlMessages id="modal.login.description" /></p>
          </div>
          <div className="centered">
            <Button width={btnWidth} height={btnHeight} onClick={onOk}><IntlMessages id="modal.login.button" /></Button>
          </div>
        </div>
      </Modal>);
  }
}

LoginModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisibility: PropTypes.func,
  view: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

LoginModal.defaultProps = {
  title: undefined,
  isVisible: false,
  setVisibility: undefined,
  view: 'MobileView',
};

export default LoginModal;
