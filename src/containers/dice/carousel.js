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

    const { locale } = props;
    this.imageArray = [`leaderboard-${locale}`, `buyback-${locale}`];
  }
  render() {
    const imageEle = _.map(this.imageArray, (row) => (<div>
      <CloudinaryImage className="" publicId={`betx/campaign/${row}`} options={{ height: 1000, crop: 'scale' }} />
    </div>));
    return (<Carousel autoplay>{imageEle}
    </Carousel>
    );
  }
}

NewsCarousel.propTypes = {
  locale: PropTypes.string,
};

NewsCarousel.defaultProps = {
  locale: 'en',
};


const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
});

export default connect(mapStateToProps, null)(NewsCarousel);
