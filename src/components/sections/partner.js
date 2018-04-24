import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class PartnerSection extends React.Component {
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
      <div className="wrapper partner" id="partner">
        <div className="horizontalWrapper">

          <h2 className="underscore">Strategic Partners</h2>
          <Row>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <div className="img-container"><CloudinaryImage publicId="polychain_vcqfqu" options={{ height: 150, crop: 'scale' }} /></div>
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
              <div className="img-container"><CloudinaryImage publicId="signum_ppnx2z" options={{ height: 150, crop: 'scale' }} /></div>
            </Col>

          </Row>
        </div>
      </div>
    </section>);
  }
}

PartnerSection.propTypes = {
};

PartnerSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default PartnerSection;
