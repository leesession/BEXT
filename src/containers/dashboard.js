/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Scroll from 'react-scroll';

import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';
import WaveAnimation from '../components/waveAnimation';

import MissionSection from '../components/sections/mission';
import InfoSection from '../components/sections/info';
import PortfolioSection from '../components/sections/portfolio';
import NewsSection from '../components/sections/news';
import StrengthSection from '../components/sections/strength';

cloudinaryConfig({ cloud_name: 'forgelab-io' });
const FormItem = Form.Item;

const {
  Link, Element, Events, scroll, scrollSpy,
} = Scroll;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', (...rest) => {
      console.log('begin', rest);
    });

    Events.scrollEvent.register('end', (...rest) => {
      console.log('end', rest);
    });
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  // handleSetActive(to) {
  //   console.log(to);
  // }

  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 1,
      sm: 3,
      md: 3,
      lg: 4,
      xl: 4,
      xxl: 4,
    };
    const ROW_GUTTER = {
      xs: 0,
      sm: 16, // Set gutter to 16 + 8 * n, with n being a natural number
      md: 24,
      lg: 24,
      xl: 32,
      xxl: 32,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    const AnyReactComponent = ({ imageId, text }) => (<div><CloudinaryImage
      publicId={imageId}
      options={{
        width: 60, height: 60, crop: 'fit',
      }}
    /><p>{text}</p></div>);

    const videoOptions = {
      autoplay: true,
      preload: 'auto',
      loop: true,
      playbackRate: 0.5,
    };

    const videoRatio = 640 / 360;
    if (window.innerWidth / window.innerHeight > videoRatio) {
      videoOptions.width = '100%';
    } else {
      videoOptions.height = '100%';
    }

    const backgroundElement = (<CloudinaryImage publicId="bg_mobile_wknqcs" style={{ height: '100%', minWidth: '100%' }} />);

    return (
      <div>
        <section style={{ height: '80vh' }}>
          <div className="head">

            <div className="content">
              <h1>BETX</h1>
            </div>

            <div className="background">
              {/* <WaveAnimation /> */}
              {/*              {backgroundElement}
*/}            </div>

          </div>
        </section>

        {/*        <MissionSection />
*/}
        <StrengthSection />

        <PortfolioSection />

        {/* <TeamSection />

        <SectionAdvisor /> */}

        <NewsSection />

        <InfoSection />
      </div>
    );
  }
}

Dashboard.propTypes = {
};

Dashboard.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
