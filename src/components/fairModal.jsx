/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { message, Button, Modal, Input, Row, Col } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IntlMessages from '../components/utility/intlMessages';
import { siteConfig } from '../settings';

class FairModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.isVisible,
    };
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


  render() {
    const { visible } = this.state;
    const { intl, value, onReset } = this.props;
    const descriptions = intl.formatMessage({ id: 'modal.fair.description' }).split('\n');

    const text = _.map(descriptions, (part, partIndex) => <p key={partIndex}>{part}</p>);
    return (<Modal
      className="refModal fairModal"
      title={<IntlMessages id="modal.fair.title" />}
      centered
      visible={visible}
      onOk={() => this.props.closeModal(false)}
      onCancel={() => {
        this.props.closeModal(false);
      }}
      width={640}
      footer={null}
    >
      <div className="refmodal-container">
        <div className="refmodal-container-input">
          <section style={{ width: '100%' }}>
            <Row>
              <Col xs={24} lg={18} ><Input className="fairCode" placeholder="Basic usage" value={value} readOnly /></Col>
              <Col xs={24} lg={6} className="fair-modal-btns">
                <Button type="primary" size="large" onClick={onReset}><IntlMessages id="modal.fair.buttonReset" /></Button>
                {/* <Button size="large"><IntlMessages id="modal.fair.buttonUpdate" /></Button> */}
              </Col>
            </Row>
          </section>
        </div>
        <div>
          <div className="modal-url"><a href={siteConfig.fairnessVerificationUrl} target="_black"><IntlMessages id="modal.fair.verificationTool" /></a></div>
          {text}
        </div>
      </div>
    </Modal>);
  }
}

FairModal.propTypes = {
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  value: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};

FairModal.defaultProps = {
  closeModal: undefined,
};

export default connect(null)(injectIntl(FairModal));
