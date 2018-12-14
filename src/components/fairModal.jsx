/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Layout, Menu, message, Button, Modal } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IntlMessages from '../components/utility/intlMessages';
import appActions from '../redux/app/actions';

class FairModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.isVisible,
    };

    this.onLoginClicked = this.onLoginClicked.bind(this);
    this.fiarText = React.createRef();
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
      title={<IntlMessages id="modal.fair.title" />}
      centered
      visible={visible}
      onOk={() => this.props.closeModal(false)}
      onCancel={() => {
        this.props.closeModal(false);
      }}
      footer={null}
    >
      <div className="refmodal-container">
        <div className="refmodal-container-input">
          <div><span ref={this.fairText}>dsUX8fhzFl1om0u3HKgP</span></div>
          <div>
            <CopyToClipboard
              text="dsUX8fhzFl1om0u3HKgP"
              onCopy={() => {
                this.fairText.current.style.background = 'blue';
              }}
            >
              <Button type="primary" size="large" onClick={this.onLoginClicked}><IntlMessages id="modal.fair.buttonReset" /></Button>
              <Button type="primary" size="large" onClick={this.onLoginClicked}><IntlMessages id="modal.fair.buttonUpdate" /></Button>
            </CopyToClipboard>
          </div>
        </div>
        <div>
          <span><IntlMessages id="modal.fair.description" /></span></div>
      </div>
    </Modal>);
  }
}

FairModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  getIdentity: PropTypes.func,
  closeModal: PropTypes.func,
};

FairModal.defaultProps = {
  getIdentity: undefined,
  closeModal: undefined,
};

const mapDispatchToProps = (dispatch) => ({
  getIdentity: () => dispatch(appActions.getIdentity()),
});

export default connect(null, mapDispatchToProps)(injectIntl(FairModal));
