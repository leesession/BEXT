/* eslint no-bitwise: 0 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Tooltip } from 'antd';

import PropTypes from 'prop-types';
import betActions from '../../redux/bet/actions';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const currencyArray = [{
  value: 'EOS',
  imgId: 'eos-logo-grey',
}, {
  value: 'BETX',
  imgId: 'betx-logo-gradient',
}, {
  value: 'EBTC',
  imgId: 'betx/ebtc-logo',
}, {
  value: 'EETH',
  imgId: 'betx/eeth-logo',
}, {
  value: 'EUSD',
  imgId: 'betx/eusd-logo',
}];

class CurrenyBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onItemClicked = this.onItemClicked.bind(this);
  }


  onItemClicked(evt) {
    const { setCurrency } = this.props;
    setCurrency(evt.target.dataset.value || evt.target.parentNode.dataset.value);
  }

  render() {
    const { selectedSymbol } = this.props;

    return (<div className="currency-bar">
      {_.map(currencyArray, (item) => {
        const itemClassname = classNames({
          'currency-bar-item': true,
          'currency-bar-item-highlight': selectedSymbol === item.value,
        });
        return (<div className={itemClassname} key={item.value} onClick={this.onItemClicked} data-value={item.value}>

          <Tooltip placement="bottom" title={item.value}>
            <div className="img-container" data-value={item.value}>
              <CloudinaryImage publicId={item.imgId} options={{ height: 30, crop: 'scale' }} />
            </div>
          </Tooltip>
          {/* <div className="text">
            {item.value}
          </div> */}
        </div>);
      })}
    </div>);
  }
}

CurrenyBar.propTypes = {
  setCurrency: PropTypes.func,
  selectedSymbol: PropTypes.string,
};

CurrenyBar.defaultProps = {
  setCurrency: undefined,
  selectedSymbol: undefined,
};

const mapStateToProps = (state) => ({
  selectedSymbol: state.Bet.get('selectedSymbol'),
});

const mapDispatchToProps = (dispatch) => ({
  setCurrency: (value) => dispatch(betActions.setCurrency(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrenyBar);
