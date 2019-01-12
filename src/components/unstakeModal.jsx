/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { message, Button, Modal, Input, Row, Col } from 'antd';
import IntlMessages from '../components/utility/intlMessages';
import { siteConfig } from '../settings';

class UnstakeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.isVisible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isVisible } = nextProps;

    if (!_.isUndefined(isVisible)) {
      this.setState({
        visible: isVisible,
      });
    }
  }


  render() {
    const { visible } = this.state;
    const { intl, value, onSelect } = this.props;
    const descriptions = intl.formatMessage({ id: 'modal.unstake.description' }).split('\n');

    const text = _.map(descriptions, (part, partIndex) => <p key={partIndex}>{part}</p>);
    return (<Modal
      className="refModal unstake-modal"
      title={<IntlMessages id="modal.unstake.title" />}
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
            <Row gutter={12}>
              <Col xs={24} lg={8}>
                <div className="unstake-modal-title"><IntlMessages id="modal.unstake.option1.title" /></div>
                <div className="unstake-modal-text"><IntlMessages id="modal.unstake.option1.text" /></div>
                <Button className="unstake-modal-btn" type="primary" size="large" data-speed="999" onClick={onSelect}><IntlMessages id="modal.unstake.button" /></Button>
              </Col>
              <Col xs={24} lg={8} >
                <div className="unstake-modal-title"><IntlMessages id="modal.unstake.option2.title" /></div>
                <div className="unstake-modal-text"><IntlMessages id="modal.unstake.option2.text" /></div>
                <Button className="unstake-modal-btn" type="primary" size="large" data-speed="2" onClick={onSelect}><IntlMessages id="modal.unstake.button" /></Button>
              </Col>
              <Col xs={24} lg={8} >
                <div className="unstake-modal-title"><IntlMessages id="modal.unstake.option3.title" /></div>
                <div className="unstake-modal-text"><IntlMessages id="modal.unstake.option3.text" /></div>
                <Button className="unstake-modal-btn" type="primary" size="large" data-speed="1" onClick={onSelect}><IntlMessages id="modal.unstake.button" /></Button>
              </Col>
            </Row>
          </section>
        </div>
      </div>
    </Modal>);
  }
}

UnstakeModal.propTypes = {
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

UnstakeModal.defaultProps = {
  closeModal: undefined,
};

export default connect(null)(injectIntl(UnstakeModal));
