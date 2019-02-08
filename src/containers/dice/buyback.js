import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Tooltip, Progress } from 'antd';
import Button from '../../components/uielements/button';
import BuybackModal from '../../components/modal/buyback';

import awardActions from '../../redux/award/actions';
import IntlMessages from '../../components/utility/intlMessages';

class BuyBack extends React.Component {
  constructor(props) {
    super(props);

    const { locale } = props;
    this.imageArray = [`leaderboard-${locale}`, `buyback-${locale}`];

    this.state = {
      isModalVisible: false,
      modalParams: {},
    };

    this.onClaimClicked = this.onClaimClicked.bind(this);
    this.setModalVisibility = this.setModalVisibility.bind(this);
    this.claimBuyback = this.claimBuyback.bind(this);
    this.onTitleClicked = this.onTitleClicked.bind(this);
  }

  componentWillMount() {
    const { fetchRedeemTable } = this.props;

    fetchRedeemTable();
  }

  setModalVisibility(value) {
    this.setState({
      isModalVisible: value,
    });
  }

  claimBuyback(params) {
    const {
      claimBuyback,
    } = this.props;

    claimBuyback(params);
  }

  onTitleClicked() {
    this.setState({
      isModalVisible: true,
      modalParams: {
        username: undefined, // This has to be undefined to tell modal this is anonymous open
        symbol: 'BETX', // Hardcode to always use BETX to buy back
        ratio: 5,
        total: 100,
      },
    });
  }

  onClaimClicked(evt) {
    const params = _.isEmpty(evt.target.dataset) ? evt.target.parentNode.dataset : evt.target.dataset;

    if (_.isEmpty(params)) {
      throw new Error('onClaimClicked params is empty!');
    }

    const {
      username, index, ratio, total,
    } = params;

    this.setState({
      isModalVisible: true,
      modalParams: {
        username,
        symbol: 'BETX', // Hardcode to always use BETX to buy back
        redeemIndex: _.toNumber(index),
        ratio: _.toNumber(ratio),
        total,
      },
    });
  }

  render() {
    const { redeems, intl, username } = this.props;
    const { isModalVisible, modalParams } = this.state;

    // const momentLocale = (locale === 'en') ? 'en' : 'zh-cn';

    const redeemList = _.map(redeems, (row) => {
      const lineHeight = 30;

      const restMilSeconds = moment.utc(row.expireAt).diff(moment());
      let expiresAt;
      let btnDisabled = (username !== row.winner || row.availableEOS === 0);

      if (restMilSeconds < 0) {
        expiresAt = intl.formatMessage({ id: 'buyback.expired' });
        btnDisabled = btnDisabled || true;
      } else {
        const duration = moment.duration(restMilSeconds);
        expiresAt = moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
      }

      const availableText = intl.formatMessage({ id: 'buyback.remaining' }, { available: row.availableEOS, total: row.totalEOS, token: 'EOS' });

      return (<li
        className="buyback-item"
        key={row.id}
      >
        <dl>
          <dt className="buyback-item-dt"><IntlMessages id="buyback.winner" /></dt><dd className="buyback-item-dd">{row.winner}</dd>
          <dt className="buyback-item-dt"><IntlMessages id="buyback.candidates" /></dt><dd className="buyback-item-dd">
            <Tooltip placement="top" title={row.candidates}>
              {row.candidateNum} <IntlMessages id="buyback.candidates.players" />
            </Tooltip>
          </dd>
          <dt></dt><dd>
            <Progress
              percent={((row.totalEOS - row.availableEOS) / row.totalEOS) * 100}
              size="small"
              strokeColor="#ffbc00"
              showInfo={false}
              format={() => intl.formatMessage({ id: { id: 'buyback.remaining' }, values: { available: row.availableEOS, total: row.totalEOS, token: 'EOS' } })}
            /></dd>
          <dt className="buyback-item-dt"><IntlMessages id="buyback.available" /></dt><dd className="buyback-item-dd">{availableText}</dd>
          <dt className="buyback-item-dt"><IntlMessages id="buyback.expiresAt" /></dt><dd className="buyback-item-dd">{expiresAt}</dd>
          <dt className="buyback-item-dt" style={{ lineHeight: `${lineHeight}px` }}>&nbsp;</dt><dd className="buyback-item-dd">
            <Button width={80} height={lineHeight} disabled={btnDisabled} onClick={this.onClaimClicked} data-username={row.winner} data-index={row.id} data-ratio={row.ratio} data-total={row.totalEOS} float="right"><IntlMessages id="buyback.claim" /></Button>
          </dd>
        </dl></li>);
    });

    return (<div id="buyback" className="hideOnMobile">
      <div className="buyback-title" onClick={this.onTitleClicked}>
        <h3><IntlMessages id="buyback.title" /></h3>
        <Icon type="question-circle" className="buyback-title-icon" />
      </div>
      <ul>{redeemList}
        <BuybackModal
          isVisible={isModalVisible}
          params={modalParams}
          onOk={this.claimBuyback}
          onClose={() => this.setModalVisibility(false)}
        />
      </ul></div>
    );
  }
}

BuyBack.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string,
  fetchRedeemTable: PropTypes.func,
  redeems: PropTypes.array,
  username: PropTypes.string,
  claimBuyback: PropTypes.func,
};

BuyBack.defaultProps = {
  locale: 'en',
  fetchRedeemTable: undefined,
  redeems: [],
  username: undefined,
  claimBuyback: undefined,
};


const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  redeems: state.Award.get('redeems'),
  username: state.App.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchRedeemTable: () => dispatch(awardActions.fetchRedeemTable()),
  claimBuyback: (params) => dispatch(awardActions.claimBuyback(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BuyBack));
