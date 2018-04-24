import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class NewsSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 1,
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
                <div className="img-container">
                  <a href="https://finance.yahoo.com/news/interview-chance-du-founding-partner-074654445.html" target="_blank">
                    <CloudinaryImage publicId="yahoo-finance_vlc3wi" options={{ height: 150, crop: 'scale' }} />
                  </a>
                </div>
              </Col>

              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="http://res.cloudinary.com/dd1ixvdxn/raw/upload/v1524374457/press-kit_zgxusc.zip" target="_blank" style={{ display: 'block', height: '100%' }} >
                    <CloudinaryImage publicId="icon-download-outline-128_gst5gj" options={{ height: 150, crop: 'scale' }} />
                  </a>
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
