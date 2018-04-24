import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class StrengthSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

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

    const isSmall = window.innerWidth < 640;
    const backgroundImageDark = isSmall
      ? 'http://res.cloudinary.com/dd1ixvdxn/image/upload/v1524278625/bg_strength_whusmv.png'
      : 'http://res.cloudinary.com/dd1ixvdxn/image/upload/v1524274803/background_contact_lfaazt.png';
    return (
      <section>
        <div className="wrapper dark strength" style={{ backgroundImage: `url(${backgroundImageDark})` }}>
          <div className="horizontalWrapper">
            <Row gutter={16}>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="icon-resources" options={{ width: 150, crop: 'fit' }} />
                <h3>Developer Community</h3>
                <p>Working with global partners, we facilitate robust developer community growth through meetups, conferences, and hackathons.</p>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="icon-services" options={{ width: 150, crop: 'fit' }} />

                <h3>Network and Resources</h3>
                <p>We have built a global decentralized collaborative network for our portfolio projects to leverage.</p>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="icon-network" options={{ width: 150, crop: 'fit' }} />

                <h3>Ecosystem Approach</h3>
                <p>We invest and incubate, keeping a close relationship with exchange, media and recruiting agency. A project should focus on innovation and product, and we deal with the rest.</p>
              </Col>
            </Row>
          </div>
        </div>
      </section>);
  }
}

StrengthSection.propTypes = {
};

StrengthSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default StrengthSection;
