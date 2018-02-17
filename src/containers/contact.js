import React, { PropTypes } from 'react';
import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';
// import GoogleMapReact from 'google-map-react';

import ContactForm from '../components/contactForm';
import InfoSection from '../components/infoSection';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });
const FormItem = Form.Item;

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>

        <section>
          <div className="wrapper contact">
            <div className="horizontalWrapper">
              <h2 className="underscore">Become a Partner</h2>
              <p></p>
              <Row type="flex" justify="center">
                <Col span={16}>
                  <ContactForm />
                </Col>
              </Row>

            </div>
          </div>
        </section>

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

        <InfoSection />

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

Contact.propTypes = {
};

Contact.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default Contact;
