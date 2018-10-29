import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';
import ScrollReveal from '../scrollReveal';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

class StrengthSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /**
 * Add event listener
 */
  componentDidMount() {
    // Slide in from top distanct offset
    const isSmall = window.innerWidth < 640;
    const offset = isSmall ? 30 : 40;
    const delay = 300;

    const revealTop = {
      origin: 'top',
      duration: isSmall ? 1000 : 600,
      distance: `${offset}px`,
      scale: 1,
      easing: 'ease',
    };

    ScrollReveal.reveal(this.part1, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.part2, _.extend(revealTop, { delay: isSmall ? 0 : delay * 2 }));
    ScrollReveal.reveal(this.part3, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
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
    // const backgroundImageDark = isSmall
    //   ? 'http://res.cloudinary.com/dd1ixvdxn/image/upload/v1524278625/bg_strength_whusmv.png'
    //   : 'http://res.cloudinary.com/dd1ixvdxn/image/upload/v1524274803/background_contact_lfaazt.png';

    return (
      <section>
        <div className="wrapper dark strength">
          <div className="horizontalWrapper">
            <Row gutter={16}>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.part1 = c; }}>
                  <Row gutter={24}>
                    <Col span={12} className="left">
                      <CloudinaryImage publicId="strength-1" options={{ height: 120, crop: 'fit' }} />
                    </Col>
                    <Col span={12} className="right">
                      <h3 >Register Today</h3>
                      <p >Fill in some simple details and you’ll be ready to go.</p>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.part2 = c; }}>
                  <Row gutter={24}>
                    <Col span={12} className="left">
                      <CloudinaryImage publicId="strength-2" options={{ height: 120, crop: 'fit' }} />
                    </Col>
                    <Col span={12} className="right">
                      <h3 >Deposit Cash</h3>
                      <p >It’s your choice to deposit up to $1000.</p>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.part3 = c; }}>
                  <Row gutter={24}>
                    <Col span={12} className="left">
                      <CloudinaryImage publicId="strength-3" options={{ height: 120, crop: 'fit' }} />
                    </Col>
                    <Col span={12} className="right">
                      <h3 >Get a Bonus</h3>
                      <p >We will give you some intro $300 money.</p>
                    </Col>
                  </Row>

                </div>
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
