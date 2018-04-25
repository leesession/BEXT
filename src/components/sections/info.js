import React, { PropTypes } from 'react';
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
                sm={8}
              >
                <ul>
                  <li ><a href="/#">Home</a></li>
                  <li ><a href="/#mission">Mission </a></li>
                  <li ><a href="/#portfolio">Portfolio </a></li>
                  <li ><a href="/jobs">Jobs</a></li>
                  <li ><a href="/contact#">Become a Partner</a></li>
                </ul>
              </Col>
              <Col
                xs={24}
                sm={10}
              >
                <p>Coefficient Ventures is a multi-strategy crypto fund with strong presence in North America, Asia and Europe. We`re constantly growing the community and welcome everyone with huge passion for blockchain to join us on this unprecedented journey.</p>
              </Col>
              <Col
                xs={24}
                sm={6}
              >
                <ul>
                  <li><p>424 Clay St, Lower Level</p></li>
                  <li><p>San Francisco CA, 94111</p></li>
                  <li><p>&nbsp;</p></li>
                  <li><p>info@coefficientventures.com</p></li>
                </ul>
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
