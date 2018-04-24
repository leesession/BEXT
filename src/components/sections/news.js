import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import ScrollReveal from '../scrollReveal';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';
import ImageContainer from '../imageContainer';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class NewsSection extends React.Component {
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
      duration: isSmall ? 800 : 600,
      scale: 1,
      easing: 'ease',
      distance: `${offset * 2}px`,
    };

    ScrollReveal.reveal(this.part1, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.part2, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
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

    return (
      <section>
        <div className="wrapper featured" id="featured">
          <div className="horizontalWrapper">

            <h2 className="underscore">News</h2>
            <Row gutter={16} type="flex" justify="center">

              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.part1 = c; }}>
                  <ImageContainer href="https://finance.yahoo.com/news/interview-chance-du-founding-partner-074654445.html" cloudinaryId="yahoo-finance_vlc3wi" />
                </div>
              </Col>

              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.part2 = c; }}>
                  <ImageContainer href="http://res.cloudinary.com/dd1ixvdxn/raw/upload/v1524374457/press-kit_zgxusc.zip" cloudinaryId="icon-download-outline-128_gst5gj" />
                  <h4>Press Kit</h4>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
              </Col>
            </Row>
          </div>
        </div>
      </section>);
  }
}

NewsSection.propTypes = {
};

NewsSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default NewsSection;
