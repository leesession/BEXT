/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import IntlMessages from '../utility/intlMessages';
import Button from '../uielements/button';
import Input from '../uielements/input';
import Modal from '../uielements/modal';

const FairnessModal = (props) => {
  const {
    intl, view, seed, onReset, isVisible, onOk, onClose,
  } = props;

  const descriptions = intl.formatMessage({ id: 'modal.fair.description' }).split('\n');

  const btnWidth = view === 'MobileView' ? 120 : 180;
  const btnHeight = view === 'MobileView' ? 40 : 48;

  const text = _.map(descriptions, (part, partIndex) => <p key={partIndex}>{part}</p>);

  return (<Modal
    isVisible={isVisible}
    title={intl.formatMessage({ id: 'modal.fair.title' })}
    onClose={onClose}
    className="modal-fairness"
  >
    <div className="form-control modal-main-margin-bottom modal-fairness-input">
      <Input
        type="text"
        name="seed"
        placeholder="User Seed"
        value={seed}
        disabled
      />
      <Button width={btnWidth} height={btnHeight} onClick={() => onReset()}><IntlMessages id="modal.fair.btnReset" /></Button>
    </div>
    <div className="form-control">
      {text}
    </div>
    <div className="form-control centered">
      <Button type="submit" width={btnWidth} height={btnHeight} onClick={onOk}><IntlMessages id="modal.fair.btnOk" /></Button>
    </div>
  </Modal>);
};

FairnessModal.propTypes = {
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  seed: PropTypes.string.isRequired,
  view: PropTypes.string,
};

FairnessModal.defaultProps = {
  view: 'MobileView',
};

export default injectIntl(FairnessModal);
