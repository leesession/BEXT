/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import IntlMessages from '../utility/intlMessages';
import appActions from '../../redux/app/actions';
import awardActions from '../../redux/award/actions';
import Modal from '../uielements/modal';
import Button from '../uielements/button';
import Input from '../uielements/input';

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
      claimBuyback, username, redeemIndex, symbol,
    } = this.props;
    const { outAmount } = this.state;

    claimBuyback({
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
    const { symbol, ratio, total } = this.props;
    const {
      intl, setVisibility, isVisible, view,
    } = this.props;
    const inAmount = _.floor((outAmount / 10000) * ratio, 4);

    const btnWidth = view === 'MobileView' ? 120 : 180;
    const btnHeight = view === 'MobileView' ? 40 : 48;


    return (<Modal
      className="modal-buyback"
      isVisible={isVisible}
      setVisibility={setVisibility}
      title={intl.formatMessage({ id: 'modal.buyback.title' })}
    >
      <div className="modal-main-box"><IntlMessages
        id="modal.buyback.description"
        values={{
          total,
          inSymbol: IN_SYMBOL,
          outSymbol: symbol,
          ratio: ratio / 10000,
        }}
      /></div>

      <div className="form-control">
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
      </div>
      <div className="form-control centered">
        <Button type="submit" width={btnWidth} height={btnHeight} onClick={this.onClaimClicked}><IntlMessages id="modal.buyback.submit" /></Button>
      </div>
    </Modal>);
  }
}

BuybackModal.propTypes = {
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool,
  setVisibility: PropTypes.func,
  claimBuyback: PropTypes.func,
  username: PropTypes.string,
  redeemIndex: PropTypes.number,
  ratio: PropTypes.number,
  symbol: PropTypes.string, // Symbol of token to be spent, default BETX
  total: PropTypes.string,
  view: PropTypes.string,
};

BuybackModal.defaultProps = {
  isVisible: false,
  setVisibility: undefined,
  claimBuyback: undefined,
  username: undefined,
  redeemIndex: undefined,
  ratio: undefined,
  symbol: undefined,
  total: undefined,
  view: 'MobileView',
};

const mapStateToProps = (state) => ({
  isVisible: state.App.get('buybackModalVisible'),
  username: state.App.get('buybackModalParams') && state.App.get('buybackModalParams').username,
  symbol: state.App.get('buybackModalParams') && state.App.get('buybackModalParams').symbol,
  redeemIndex: state.App.get('buybackModalParams') && state.App.get('buybackModalParams').redeemIndex,
  ratio: state.App.get('buybackModalParams') && state.App.get('buybackModalParams').ratio,
  total: state.App.get('buybackModalParams') && state.App.get('buybackModalParams').total,
});

const mapDispatchToProps = (dispatch) => ({
  setVisibility: (value) => dispatch(appActions.setBuybackModalVisibility(value)),
  claimBuyback: (params) => dispatch(awardActions.claimBuyback(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BuybackModal));
