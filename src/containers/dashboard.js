/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Scroll from 'react-scroll';

import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';
import WaveAnimation from '../components/waveAnimation';

import InfoSection from '../components/sections/info';
import PortfolioSection from '../components/sections/portfolio';
import NewsSection from '../components/sections/news';
import StrengthSection from '../components/sections/strength';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });
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

    const backgroundElement = window.innerWidth < 640
      ? <CloudinaryImage publicId="bg_mobile_wknqcs" style={{ height: '100%', minWidth: '100%' }} />
      : <CloudinaryVideo publicId="Abstract-moving-background-720p" style={{ height: '100%', minWidth: '100%' }} options={videoOptions}></CloudinaryVideo>;

    const isSmall = window.innerWidth < 640;
    const quote = isSmall ? (<p className="quote">It was the best of times<br />It was the worst of times<br />
      It was the age of wisdom<br />It was the age of foolishness<br />
      It was the epoch of belief<br />It was the epoch of incredulity</p>)
      : (<p className="quote">It was the best of times, it was the worst of times<br />
        It was the age of wisdom, it was the age of foolishness<br />
        It was the epoch of belief, it was the epoch of incredulity</p>);
    return (
      <div>

        <section style={{ height: '100vh' }}>
          <div className="head">

            <div className="content">
              <h1>Coefficient Ventures</h1>
            </div>

            <div className="background">
              {/* <WaveAnimation /> */}
              {backgroundElement}
            </div>

          </div>
        </section>

        <section>
          <div className="wrapper mission" id="mission">
            {/*            <Element name="test1" className="element">element here</Element> */}
            <div className="horizontalWrapper">
              <Row type="flex" justify="center">
                <Col xs={20} sm={18}>
                  {/* <h2 className="underscore">Our Mission</h2> */}
                  {quote}

                  <p>Coefficient Ventures is a multi-strategy crypto fund with strong presence in North America, Asia and Europe. We believe the revolution that blockchain brings us upon has just begun. The applications for blockchain technology are endless. We are proud to be part of this age, and are constantly seeking like-minds with passion and determination. Together, we change the world for the better.</p>
                </Col>
              </Row>
            </div>
          </div>
        </section>

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
