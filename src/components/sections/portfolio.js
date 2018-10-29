import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import ScrollReveal from '../scrollReveal';

import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class PortfolioSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /**
  * Add event listener
  */
  componentDidMount() {
    // Slide in from right distanct offset
    const isSmall = window.innerWidth < 640;
    const offset = isSmall ? 30 : 40;
    const delay = 200;

    // SlideIn from right
    const revealTop = {
      origin: 'top',
      duration: 600,
      scale: 1,
      easing: 'ease',
      distance: `${offset * 2}px`,
    };

    // ScrollReveal.reveal(this.port1, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    // ScrollReveal.reveal(this.port2, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    // ScrollReveal.reveal(this.port3, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
    // ScrollReveal.reveal(this.port4, _.extend(revealTop, { delay: isSmall ? delay : delay * 4 }));

    // ScrollReveal.reveal(this.port5, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    // ScrollReveal.reveal(this.port6, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    // ScrollReveal.reveal(this.port7, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
    // ScrollReveal.reveal(this.port8, _.extend(revealTop, { delay: isSmall ? delay : delay * 4 }));

    // ScrollReveal.reveal(this.port9, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    // ScrollReveal.reveal(this.port10, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    // ScrollReveal.reveal(this.port11, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));

    ScrollReveal.reveal(this.advisory1, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.advisory2, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    ScrollReveal.reveal(this.advisory3, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
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

    const COL_PER_ROW_ADVISORY = { // Specify how many col in each row
      xs: 2,
      sm: 3,
    };

    // Calculate grid number for Col attribute
    const colWidthAdvisory = {};

    Object.keys(COL_PER_ROW_ADVISORY).forEach((key) => {
      colWidthAdvisory[key] = 24 / COL_PER_ROW_ADVISORY[key];
    });

    const isSmall = window.innerWidth < 640;

    return (
      <section>
        <div className="wrapper portfolio" id="portfolio">
          <div className="horizontalWrapper">
            <h2 className="underscore">Be In Control</h2>
            <Row gutter={16} type="flex">

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div ref={(c) => { this.advisory1 = c; }}>
                  <CloudinaryImage publicId="Icon-1" options={{ height: 150, crop: 'scale' }} />
                  <h4>Deposit limit</h4><p>Play in confidence by setting a deposit limit that prevents you from depositing more than you should.</p>
                </div>

              </Col>

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div ref={(c) => { this.advisory2 = c; }}>
                  <CloudinaryImage publicId="Icon-2" options={{ height: 150, crop: 'scale' }} />
                  <h4>loss limit</h4><p>It’s easy to lose track of time when you’re having fun. Set yourself a loss limit to prevent any surprises.</p>
                </div>
              </Col>

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div ref={(c) => { this.advisory3 = c; }}>
                  <CloudinaryImage publicId="Icon-3" options={{ height: 150, crop: 'scale' }} />
                  <h4>Deposit limit</h4><p>Wagering is the amount of money placed on bets. You don’t want to go overboard?</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>);
  }
}

PortfolioSection.propTypes = {
};

PortfolioSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default PortfolioSection;
