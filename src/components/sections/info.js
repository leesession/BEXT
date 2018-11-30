import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../../components/react-cloudinary';

class InfoSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (

      <section>
        <div className="wrapper dark info">
          <div className="horizontalWrapper">
            <Row>
              <Col
                xs={24}
                md={7}
              >
                <h4>Join the Winners</h4>

                <div className="list">
                  <p className="purple">Latest Weekly Winners</p>
                  <ul>
                    <li ><span>djcosmy - $499</span></li>
                    <li ><span>KevinJamsons - $1028</span></li>
                    <li ><span>Ercikamobs - $498</span></li>
                    <li ><span>Ercikamobs - $498</span></li>
                    <li ><span>Ercikamobs - $498</span></li>
                  </ul>
                </div>
              </Col>
              <Col
                xs={24}
                md={7}
              >
                <h4>Website 100% Secure</h4>
                <div className="list">
                  <ul>
                    <li className="purple">Casino with DGOJ license</li>
                    <li className="purple">Software Certificated</li>
                    <li className="purple">Secure Transactions</li>
                    <li className="purple">Live Scores</li>
                    <li className="purple">Bonus Upon Registration</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={10}>
                <h4>Payments Accepted</h4>
                <div className="payments">
                  <Row type="flex" gutter={24}>
                    <Col span={6}>
                      <a href={null}>
                  EOS
                      </a>
                    </Col>
                    <Col span={6}>
                      <a href={null}>
                  ETH
                      </a>
                    </Col>
                    <Col span={6}>
                    </Col>
                  </Row>


                </div>
                <h4>Subscribe for offers</h4>
                <div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>
    );
  }
}

InfoSection.propTypes = {
};

InfoSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default InfoSection;
