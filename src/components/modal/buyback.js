/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import IntlMessages from '../utility/intlMessages';
import Modal from '../uielements/modal';
import Button from '../uielements/button';
import Input from '../uielements/input';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const DEFAULT_OUT_AMOUNT = 0;
const IN_SYMBOL = 'EOS'; // Hard code to always buy EOS

class BuybackModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      outAmount: DEFAULT_OUT_AMOUNT,
    };

    this.onClaimClicked = this.onClaimClicked.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onClaimClicked() {
    const {
      params, onOk, onClose,
    } = this.props;

    const { username, redeemIndex, symbol } = params;

    // Anonymous case
    if (_.isUndefined(username)) {
      onClose();
      return;
    }

    const { outAmount } = this.state;

    onOk({
      username,
      quantity: `${outAmount.toFixed(4)} ${symbol}`,
      redeemIndex,
    });
  }

  onInputChange(evt) {
    const { value } = evt.target;

    if (value === '' || value[value.length - 1] === '.') {
      this.setState({
        inputValue: value,
        outAmount: DEFAULT_OUT_AMOUNT,
      });

      return;
    }

    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

    if (value.match(reg)) {
      this.setState({
        inputValue: value,
        outAmount: _.floor(_.toNumber(value), 2),
      });
    }
  }

  render() {
    const { inputValue, outAmount } = this.state;
    const {
      intl, setVisibility, isVisible, view, onClose, params,
    } = this.props;

    const {
      username, symbol, ratio, total,
    } = params;

    const inAmount = _.floor((outAmount / 10000) * ratio, 4);

    const btnWidth = view === 'MobileView' ? 120 : 180;
    const btnHeight = view === 'MobileView' ? 40 : 48;

    const isWinner = !_.isUndefined(username);

    return (<Modal
      className="modal-buyback"
      isVisible={isVisible}
      setVisibility={setVisibility}
      onClose={onClose}
      title={isWinner ? intl.formatMessage({ id: 'modal.buyback.title' }) : intl.formatMessage({ id: 'modal.buyback.titleAnonymous' })}
    >
      <div className="modal-main-box">
        <p>
          <IntlMessages
            id="modal.buyback.description"
            values={{
              total,
              inSymbol: IN_SYMBOL,
              outSymbol: symbol,
              outTotal: (total * 10000) / ratio,
              ratio: ratio / 10000,
            }}
          />
        </p>
        <p>{isWinner ? <IntlMessages id="modal.buyback.askInput" values={{ outSymbol: symbol }} /> : <IntlMessages id="modal.buyback.showInput" />}</p>
        {isWinner ? null : <div style={{ textAlign: 'center' }}><CloudinaryImage publicId="betx/buyback-showcase" options={{ height: 200, crop: 'scale' }} /></div>}
      </div>

      {isWinner ? (<div className="form-control centered">
        <Input
          type="text"
          name="amount"
          placeholder={`${symbol} Amount`}
          value={inputValue}
          onChange={this.onInputChange}
        />
        <div className="modal-main-box"><IntlMessages
          id="modal.buyback.textConfirm"
          values={{
            outAmount, outSymbol: symbol, inAmount, inSymbol: IN_SYMBOL,
          }}
        /></div>
      </div>) : null}

      <div className="form-control centered">
        <Button type="submit" width={btnWidth} height={btnHeight} style={{ margin: '12px auto' }} onClick={this.onClaimClicked}><IntlMessages id={isWinner ? 'modal.buyback.submit' : 'modal.buyback.ok'} /></Button>
      </div>
    </Modal>);
  }
}

BuybackModal.propTypes = {
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool,
  setVisibility: PropTypes.func,
  params: PropTypes.object,
  view: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

BuybackModal.defaultProps = {
  isVisible: false,
  setVisibility: undefined,
  params: undefined,
  view: 'MobileView',
};

export default injectIntl(BuybackModal);
