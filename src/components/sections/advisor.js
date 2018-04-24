import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class AdvisorSection extends React.Component {
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
              <h4>Ryan Zurrer</h4><h5>General Advisor</h5><h5>Partner at Polychain Capital</h5></Col>
          </Row>
          <Row gutter={16} type="flex" justify="center">
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="jeromy-bw_aamnes" options={{ width: 300, crop: 'scale' }} />
              <h4>Jeromy</h4><h5>Technical Advisor</h5><h5>Core developer of IPFS</h5></Col>
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="daneil-round_bbfgap" options={{ width: 300, crop: 'scale' }} />
              <h4>Daniel Ternyak</h4><h5>Technical Advisor</h5><h5>CTO of MyCrypto</h5></Col>
            {/*
            <Col
              xs={colWidth.xs}
              sm={colWidth.sm}
            >
              <CloudinaryImage publicId="est-round_ihb4uc" options={{ width: 300, crop: 'scale' }} />
              <h4>Esteban Ordano</h4><h5>Technical Advisor</h5></Col> */}
          </Row>
        </div>
      </div>
    </section>);
  }
}

AdvisorSection.propTypes = {
};

AdvisorSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default AdvisorSection;
