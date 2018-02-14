/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
// import GoogleMapReact from 'google-map-react';
import * as Scroll from 'react-scroll';
// import { Link } from 'react-router-dom';

import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';
import WaveAnimation from '../components/waveAnimation';

import InfoSection from '../components/infoSection';

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

    return (
      <div>

        <section style={{ height: '100vh' }}>
          <div className="head">

            <div className="content">
              <h1>Coefficient Ventures</h1>
              <h2>The true DAO of decentralized space.</h2>
            </div>

            <div className="background">
              {/* <WaveAnimation /> */}
              {/*              <CloudinaryVideo
                publicId="moving-background"
                options={videoOptions}
              >
              </CloudinaryVideo> */}
            </div>

          </div>
        </section>

        <section>
          <div className="wrapper mission" id="mission">
            {/*            <Element name="test1" className="element">element here</Element> */}
            <div className="horizontalWrapper">
              <h2 className="underscore">Our Mission</h2>
              <p>The Blockchain, a novel financial technology, holds the promise to disrupt legacy parts of financial services and create new markets. The firm has invested in 72 companies in the last three years, investing alongside Silicon Valley’s leading venture capital firms. We are a sector specific, but multi-stage venture capital investor that seeks to gain diverse exposure to the Blockchain economy while offering unique co-investment opportunities and proprietary deal flow to our investors.</p>
            </div>
          </div>
        </section>

        <SectionStrength />

        <SectionPortfolio />

        <SectionTeam />

        <SectionAdvisor />
        {/* <Element name="test2" className="element">
          test 2
        </Element> */}
        <SectionPartners />

        {/*        <section>
          <div className="wrapper contact dark">
            <div className="horizontalWrapper">

              <h2 className="underscore">Contact</h2>
              <Row>
                <Col
                  offset={4}
                  span={16}
                >
                  <ContactForm />
                </Col>
              </Row>
            </div>
          </div>
        </section> */}

        <section>
          <div className="wrapper dark info">
            <div className="horizontalWrapper">
              <Row>
                <Col
                  xs={24}
                  sm={8}
                >
                  <ul>
                    {/* <li><Link activeClass="active" to="test2" spy smooth duration={500}>Test 2</Link></li> */}
                    <li><h5>
                      {/* <Link to="test1" containerId="scrollContainer" spy smooth offset={50} duration={500}>Test 1
                      </Link> */}
                    </h5></li>
                    {/* <li><h5>Ecosystem</h5></li> */}
                    <li><Link to="/#portfolio"><h5>Portfolio</h5></Link></li>
                    <li><h5>Team</h5></li>
                    <li><h5>Partners</h5></li>
                    <li><h5>Become a partner</h5></li>
                  </ul>
                </Col>
                <Col
                  xs={24}
                  sm={10}
                >
                  <p>The Blockchain, a novel financial technology, holds the promise to disrupt legacy parts of financial services and create new markets. The firm has invested in 72 companies in the last three years, investing alongside Silicon Valley’s leading venture capital firms. </p>
                </Col>
                <Col
                  xs={24}
                  sm={6}
                >
                  <ul>
                    <li><p>865 Market St</p></li>
                    <li><p>San Francisco CA, 94103</p></li>
                    <li><p>+1 (312) 912-5775</p></li>
                    <li><p>contract@bnf.capital</p></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </section>

        {/* <section>
          <div className="wrapper map">
            <div style={{ height: '100%' }}>
                            <GoogleMapReact
                defaultCenter={{ lat: 37.784326, lng: -122.406359 }}
                defaultZoom={17}
                options={{
                  draggable: false,
                  fullscreenControl: false,
                  scrollwheel: false,
                  styles: [
                    {
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#f5f5f5',
                        },
                      ],
                    },
                    {
                      elementType: 'labels.icon',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#616161',
                        },
                      ],
                    },
                    {
                      elementType: 'labels.text.stroke',
                      stylers: [
                        {
                          color: '#f5f5f5',
                        },
                      ],
                    },
                    {
                      featureType: 'administrative.land_parcel',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#bdbdbd',
                        },
                      ],
                    },
                    {
                      featureType: 'poi',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#eeeeee',
                        },
                      ],
                    },
                    {
                      featureType: 'poi',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#757575',
                        },
                      ],
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#e5e5e5',
                        },
                      ],
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#9e9e9e',
                        },
                      ],
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#ffffff',
                        },
                      ],
                    },
                    {
                      featureType: 'road.arterial',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#757575',
                        },
                      ],
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#dadada',
                        },
                      ],
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#616161',
                        },
                      ],
                    },
                    {
                      featureType: 'road.local',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#9e9e9e',
                        },
                      ],
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#e5e5e5',
                        },
                      ],
                    },
                    {
                      featureType: 'transit.station',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#eeeeee',
                        },
                      ],
                    },
                    {
                      featureType: 'water',
                      elementType: 'geometry',
                      stylers: [
                        {
                          color: '#c9c9c9',
                        },
                      ],
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.fill',
                      stylers: [
                        {
                          color: '#9e9e9e',
                        },
                      ],
                    },
                  ],
                }}
              >
                <AnyReactComponent
                  lat={37.784326}
                  lng={-122.406359}
                  text=""
                  imageId="if_map-marker_322462_1_ipmwnh"
                />
              </GoogleMapReact>
            </div>
          </div>
        </section> */}
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

const SectionStrength = React.createClass({
  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 1,
      sm: 3,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    return (
      <section>
        <div className="wrapper dark strength">
          <div className="horizontalWrapper">
            <Row gutter={16}>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="icon-resources" options={{ width: 150, crop: 'fit' }} />
                <h3>Abundant Resources</h3>
                <p>We’re vertically integrated, from incubator to venture fund to exchange, and are positioned to help projects at any stage of their development</p>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="icon-services" options={{ width: 150, crop: 'fit' }} />

                <h3>Full Services</h3>
                <p>From financial advising to legal consultancy, with more than 10 years accumulated experience we are confident to assist newborns to thrive.</p>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="icon-network" options={{ width: 150, crop: 'fit' }} />

                <h3>Ecosystem Approach</h3>
                <p>Our portfolio companies get access to the best network in China, greatly accelerating their growth and success rate.</p>
              </Col>
            </Row>
          </div>
        </div>
      </section>);
  },
});

const SectionPortfolio = React.createClass({
  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 2,
      sm: 4,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    return (

      <section>
        <div className="wrapper portfolio" id="portfolio">
          <div className="horizontalWrapper">
            <h2 className="underscore">Portfolio</h2>
            <Row gutter={16}>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-filecoin" options={{ height: 150, crop: 'scale' }} />
                <h4>FIL</h4><p>Filecoin</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-rdn" options={{ height: 150, crop: 'scale' }} />
                <h4>RDN</h4><p>Raiden</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-zeppelin" options={{ height: 150, crop: 'scale' }} />
                <h4>ZEP</h4><p>Zeppelin_OS</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-0x" options={{ height: 150, crop: 'scale' }} />
                <h4>ZRX</h4><p>0x</p></Col>

              {/*              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-keep" options={{ height: 150, crop: 'scale' }} />
                <h4>KEEP</h4><p>Keep</p></Col> */}
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="kowala-color_u15mlz" options={{ height: 150, crop: 'scale' }} />
                <h4>kUSD</h4><p>Kowala</p></Col>

            </Row>
            <h2>Advisory Portfolio</h2>
            <Row gutter={16} type="flex" justify="center">
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-iotex" options={{ height: 150, crop: 'scale' }} />
                <h4>IoTeX</h4><p>IoTex</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="logo-tomochain" options={{ height: 150, crop: 'scale' }} />
                <h4>TMC</h4><p>TomoChain</p></Col>
            </Row>

          </div>
        </div>
      </section>);
  },
});

const SectionTeam = React.createClass({
  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 1,
      sm: 3,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    return (
      <section>
        <div className="wrapper dark team" id="team">
          <div className="horizontalWrapper">

            <h2 className="underscore">Our Team</h2>
            <Row gutter={16}>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="chance-bw_qv7s36" options={{ width: 300, crop: 'scale' }} />
                <h4>Chance Du</h4>
                <h5>Managing Partner</h5>
                {/*                <p>All in blockchain. <br />
                Investor of Filecoin, Raiden, Zeppelin, 0x, Tari.<br />
                First investor and advisor for Tomochain and IoTex.<br />
                Asian market strategic partner of Filecoin and 0x. <br />
                Chance is also a lecturer for Stanford undergraduate Beyond Bitcoin class. Investing in tokens since Jan, 2017, prior to start Coefficient, Chance is an angel investor in the valley investing in Blockchain and AI/ML. Prior to that, she started her first startup in 2011, got acquired in 2015.
                </p> */}
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="chris-sm_fz6sq9" options={{ width: 300, crop: 'scale' }} />
                <h4>Chris Li</h4>
                <h5>Technical Partner</h5>
                {/*                <p>Blockchain developer and open source contributor <br />
                Prediction market experts <br />
                Serial entrepreneur <br />
                Microsoft senior software engineer (2013 - 16) <br />
                Individual investments: REP, OMG, ADA, RDN and MKR <br />
                M.S. in C.S., UIC
                </p> */}
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="aaron-bw_gr6utp" options={{ width: 300, crop: 'scale' }} />
                <h4>Aaron Li</h4>
                <h5>Technical Partner</h5>

                {/*                <p>Founder of Qukka.ai <br />
                Inference lead engineer in Scaled Inference <br />
                (Backed by Khosla Ventures, Lux Capital) <br />
                Google AI/ ML researcher.   <br />
                ACM SIGKDD 2014 Best Paper Award. <br />
                Bitcoin early adopter since 2013, blockchain and smart contracts lecturer at Big tiger. <br />
                M.S. in C.S., CMU
                </p> */}

              </Col>
            </Row>
          </div>
        </div>
      </section>);
  },
});

const SectionAdvisor = React.createClass({
  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 1,
      sm: 3,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    return (<section>
      <div className="wrapper advisor" id="advisor">
        <div className="horizontalWrapper">

          <h2 className="underscore">Advisors</h2>
          <Row gutter={16} type="flex" justify="center">
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="ryan-bw_cwwrfe" options={{ width: 300, crop: 'scale' }} />
              <h4>Ryan Zurrer</h4><h5>General Advisor</h5></Col>
          </Row>
          {/*          <Row gutter={16}>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="jeromy_rxqrrr" options={{ width: 150, crop: 'scale' }} />
              <h4>Jeromy</h4><h5>Technical Advisor</h5></Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="daneil-round_bbfgap" options={{ width: 150, crop: 'scale' }} />
              <h4>Daniel Ternyak</h4><h5>Technical Advisor</h5></Col>

            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="est-round_ihb4uc" options={{ width: 150, crop: 'scale' }} />
              <h4>Esteban Ordano</h4><h5>Technical Advisor</h5></Col>
          </Row> */}
        </div>
      </div>
    </section>);
  },
});

const SectionPartners = React.createClass({
  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 2,
      sm: 4,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    return (<section>
      <div className="wrapper partner" id="partner">
        <div className="horizontalWrapper">

          <h2 className="underscore">Strategic Partners</h2>
          <Row>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container">
                <CloudinaryImage publicId="polychain_vcqfqu" options={{ height: 150, crop: 'scale' }} />
              </div>
            </Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="fbg_suhplm" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="neo-global-capital_bgdzin" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>

            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="kyber_pf31oj" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>

            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="struck-black_y5algk" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>

            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="gbic_xpvely" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="connect_h7rnap" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="genesis_o4cysg" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="crypto-parency_acpecy" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>
          </Row>
        </div>
      </div>
    </section>);
  },
});
