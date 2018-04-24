import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class ServiceSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

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
      <div className="wrapper services" id="services">
        <div className="horizontalWrapper">
          <h2 className="underscore">Services Provided</h2>
          <Row gutter={16} type="flex" justify="center">
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="logo-filecoin" options={{ height: 150, crop: 'scale' }} />
              <h4>Filecoin</h4><p>Asian Market Strategy</p></Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="ontology_ktenpj" options={{ height: 150, crop: 'scale' }} />
              <h4>Ontology</h4><p>Global Expansion Partner</p></Col>
          </Row>
        </div>
      </div>
    </section>);
  }
}

ServiceSection.propTypes = {
};

ServiceSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default ServiceSection;
