import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Carousel } from 'antd';

import _ from 'lodash';

import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';
cloudinaryConfig({ cloud_name: 'forgelab-io' });


class NewsCarousel extends React.Component {
  constructor(props) {
    super(props);

    const { locale } = this.props;
    this.imageArray = [`leaderboard-small-${locale}`, 'buyback-small-zh'];
  }

  render() {
    const { className } = this.props;

    const classes = className ? `${className} carousel` : 'carousel';
    const imageEle = _.map(this.imageArray, (row) => (
      <CloudinaryImage className="" key={row} publicId={`betx/campaign/${row}`} style={{ height: '100%' }} options={{ width: 1080, crop: 'scale' }} />
    ));
    return (<Carousel className={classes} autoplay>{imageEle}
    </Carousel>
    );
  }
}

NewsCarousel.propTypes = {
  locale: PropTypes.string,
  className: PropTypes.string,
};

NewsCarousel.defaultProps = {
  locale: 'en',
  className: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
});

export default connect(mapStateToProps, null)(NewsCarousel);
