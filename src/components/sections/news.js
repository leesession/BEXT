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
    return (
      <section>
        <div className="wrapper featured" id="featured">
          <div className="horizontalWrapper">
            <Row gutter={32} type="flex" justify="center">

              <Col
                span={10}
              >
                <div ref={(c) => { this.part1 = c; }} className="left">
                  <CloudinaryImage publicId="reward-icons" options={{ height: 500, crop: 'scale' }} />
                </div>
              </Col>

              <Col
                span={14}
              >
                <div ref={(c) => { this.part2 = c; }} className="right">
                  <h2>Unlock up to 420 Free Spins*</h2>
                  <p>For only 2 deposits of €20 played in the Casino, unlock an exciting
 journey filled with thrills, rewards and plenty of fun. Join the award winning online casino and experience the best online slot machines, table games and progressive jackpots.</p>
                  <CloudinaryImage publicId="join-button" options={{ height: 100, crop: 'scale' }} />
                </div>
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
