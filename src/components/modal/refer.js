/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import PropTypes from 'prop-types';
import IntlMessages from '../utility/intlMessages';
import Button from '../uielements/button';
import Modal from '../uielements/modal';

class ReferModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCopied: false,
    };
  }

  render() {
    const {
      view, isVisible, onOk, onClose, url, title,
    } = this.props;

    const { isCopied } = this.state;

    const btnWidth = view === 'MobileView' ? 120 : 180;
    const btnHeight = view === 'MobileView' ? 40 : 48;

    return (<Modal
      isVisible={isVisible}
      title={title}
      onClose={onClose}
      className="modal-ref"
    >
      <div className="modal-main-box" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flexGrow: 1, lineHeight: '40px' }}>{url}</span>
        <span style={{ paddingRight: '12px' }}>{isCopied ? 'Copied' : ''}</span>
        <CopyToClipboard
          text={url}
          onCopy={() => this.setState({ isCopied: true })}
        >
          <Button width={btnWidth} height={btnHeight}><IntlMessages id="topbar.copy" /></Button>
        </CopyToClipboard>
      </div>
      <div className="modal-main-box">
        <span><IntlMessages id="topbar.copy.description" /></span>
      </div>
      <div className="modal-main-box centered">
        <Button width={btnWidth} height={btnHeight} onClick={onOk}><IntlMessages id="modal.refer.btnOk" /></Button>
      </div>
    </Modal>);
  }
}
ReferModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  view: PropTypes.string,
  url: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
};

ReferModal.defaultProps = {
  view: 'MobileView',
  title: undefined,
};

export default ReferModal;
