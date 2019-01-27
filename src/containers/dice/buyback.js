import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Tooltip, Progress } from 'antd';
import Button from '../../components/uielements/button';

import awardActions from '../../redux/award/actions';
import IntlMessages from '../../components/utility/intlMessages';

import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';
cloudinaryConfig({ cloud_name: 'forgelab-io' });

class BuyBack extends React.Component {
  constructor(props) {
    super(props);

    const { locale } = props;
    this.imageArray = [`leaderboard-${locale}`, `buyback-${locale}`];
  }

  componentWillMount() {
    const { fetchRedeemTable } = this.props;

    fetchRedeemTable();
  }

  render() {
    const { redeems, intl, username } = this.props;

    // const momentLocale = (locale === 'en') ? 'en' : 'zh-cn';

    const redeemList = _.map(redeems, (row) => {
      const lineHeight = 30;

      const restMilSeconds = moment(row.expireAt).diff(moment());
      let expiresAt;
      let btnDisabled = (username !== row.winner);

      if (restMilSeconds < 0) {
        expiresAt = intl.formatMessage({ id: 'buyback.expired' });
        btnDisabled = btnDisabled || true;
      } else {
        const duration = moment.duration(restMilSeconds);
        expiresAt = `${duration.get('hours')}:${duration.get('minutes')}:${duration.get('seconds')}`;
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
              format={(percent) => intl.formatMessage({ id: { id: 'buyback.remaining' }, values: { available: row.availableEOS, total: row.totalEOS, token: 'EOS' } })}
            /></dd>
          <dt className="buyback-item-dt"><IntlMessages id="buyback.available" /></dt><dd className="buyback-item-dd">{availableText}</dd>
          <dt className="buyback-item-dt"><IntlMessages id="buyback.expiresAt" /></dt><dd className="buyback-item-dd">{expiresAt}</dd>
          <dt className="buyback-item-dt" style={{ lineHeight: `${lineHeight}px` }}>&nbsp;</dt><dd className="buyback-item-dd">
            <Button width={80} height={lineHeight} disabled={btnDisabled} float="right"><IntlMessages id="buyback.claim" /></Button>
          </dd>
        </dl></li>);
    });
    return (<ul id="buyback" className="hideOnMobile">{redeemList}</ul>
    );
  }
}

BuyBack.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string,
  fetchRedeemTable: PropTypes.func,
  redeems: PropTypes.array,
  username: PropTypes.string,
};

BuyBack.defaultProps = {
  locale: 'en',
  fetchRedeemTable: undefined,
  redeems: [],
  username: undefined,
};


const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  redeems: state.Award.get('redeems'),
  username: state.App.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchRedeemTable: () => dispatch(awardActions.fetchRedeemTable()),
});


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BuyBack));
