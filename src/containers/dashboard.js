/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from 'react-cloudinary';
import GoogleMapReact from 'google-map-react';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import dashboardActions from '../redux/dashboard/actions';
import appActions from '../redux/app/actions';
import ContactForm from '../contactForm';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });
const FormItem = Form.Item;

const TAB_BETTING = 0;
const TAB_SETTING = 1;
const TAB_VOTING = 2;
const TAB_COMPLETED = 3;
const DEFAULT_TAB_INDEX = TAB_BETTING;
const NUM_SHOW_IN_OPTIONS = 3;
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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
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

    return (
      <div>

        <section style={{ height: '100vh' }}>
        </section>

        <section>
          <div className="wrapper">
            <div className="horizontalWrapper">
              <h2>Our Mission</h2>
              <p>The Blockchain, a novel financial technology, holds the promise to disrupt legacy parts of financial services and create new markets. The firm has invested in 72 companies in the last three years, investing alongside Silicon Valley’s leading venture capital firms. We are a sector specific, but multi-stage venture capital investor that seeks to gain diverse exposure to the Blockchain economy while offering unique co-investment opportunities and proprietary deal flow to our investors.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="wrapper dark strength">
            <div className="horizontalWrapper">

              <h2>Strength</h2>
              <Row>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h3>Industry Experience</h3>
                  <p>With 6 years of crypto asset investment experience, we hold a deep understanding of blockchain industry.</p>
                </Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                >
                  <h3>Abundant Resources</h3>
                  <p>We’re vertically integrated, from incubator to venture fund to exchange, and are positioned to help projects at any stage of their development</p>
                </Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                >
                  <h3>Full Services</h3>
                  <p>From financial advising to legal consultancy, with more than 10 years accumulated experience we are confident to assist newborns to thrive.</p>
                </Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                >
                  <h3>Entrepreneurial Practice</h3>
                  <p>Having been through a variety of crypto projects ourselves, we understand the top priorities of different stages of a new company.</p>
                </Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                >
                  <h3>Ecosystem Approach</h3>
                  <p>Our portfolio companies get access to the best network in China, greatly accelerating their growth and success rate.</p>
                </Col>
              </Row>
            </div>
          </div>
        </section>

        <section>
          <div className="wrapper">
            <div className="horizontalWrapper">

              <h2>Portofolio</h2>
              <Row>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>MKR</h4><p>Maker</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>RDN</h4><p>Raiden</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>ADA</h4><p>Cardano</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>OMG</h4><p>OmiseGO</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>LSK</h4><p>Lisk</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>ADT</h4><p>adToken</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>REP</h4><p>Augur</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>RCN</h4><p>Ripio Credit Network</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>XEM</h4><p>New Economy Movement</p></Col>
              </Row>
            </div>
          </div>
        </section>

        <section>
          <div className="wrapper dark">
            <div className="horizontalWrapper">

              <h2>Team</h2>
              <Row>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>Chris Li</h4><p>Managing Partner</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>Yuanbo Wang</h4><p>Founding Partner</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                ><h4>Chuck Zhang</h4><p>Founding Partner</p></Col>
              </Row>
            </div>
          </div>
        </section>

        <section>
          <div className="wrapper advisor">
            <div className="horizontalWrapper">

              <h2>Advisors</h2>
              <Row>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                >
                  <CloudinaryImage publicId="justin" />

                  <h4>Justin Newton</h4><p>Founder and CEO at Netki</p></Col>
                <Col
                  xs={colWidth.xs}
                  sm={colWidth.sm}
                  xl={colWidth.xl}
                >
                  <CloudinaryImage publicId="russ" />

                  <h4>Russ Gurvits</h4><p>Founding partner at Consensys</p></Col>
              </Row>
            </div>
          </div>
        </section>

        <section>
          <div className="wrapper dark">
            <div className="horizontalWrapper">

              <h2>Contact</h2>
              <Row>
                <Col
                  xs={20}
                  sm={16}
                >
                  <ContactForm />
                </Col>
              </Row>
            </div>
          </div>
        </section>

        <section>
          <div className="wrapper dark info">
            <div className="horizontalWrapper">
              <Row>
                <Col
                  xs={24}
                  sm={8}
                >
                  <ul>
                    <li><h5>Mission</h5></li>
                    <li><h5>Strength</h5></li>
                    <li><h5>Portofolio</h5></li>
                    <li><h5>Team</h5></li>
                    <li><h5>Advisor</h5></li>
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

        <section>
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
        </section>
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
