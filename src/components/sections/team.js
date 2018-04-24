import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class TeamSection extends React.Component {
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

    return (
      <section>
        <div className="wrapper dark team" id="team">
          <div className="horizontalWrapper">

            <h2 className="underscore">Our Team</h2>
            <Row gutter={16} type="flex" justify="center">
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <CloudinaryImage publicId="chance-bw_qv7s36" options={{ width: 300, crop: 'scale' }} />
                <h4>Chance Du</h4>
                <h5>Founding Partner</h5>
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
                <h5>Partner</h5>
                {/*                <p>Blockchain developer and open source contributor <br />
                Prediction market experts <br />
                Serial entrepreneur <br />
                Microsoft senior software engineer (2013 - 16) <br />
                Individual investments: REP, OMG, ADA, RDN and MKR <br />
                M.S. in C.S., UIC
                </p> */}
              </Col>
            </Row>
          </div>
        </div>
      </section>);
  }
}

TeamSection.propTypes = {
};

TeamSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default TeamSection;
