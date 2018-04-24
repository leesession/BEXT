import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import ScrollReveal from '../scrollReveal';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';
import ImageContainer from '../imageContainer';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class MissionSection extends React.Component {
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

    // SlideIn from right
    ScrollReveal.reveal(this.para1, _.extend({
      origin: 'right',
      duration: 1000,
      delay: isSmall ? 0 : 300,
      distance: '0px',
      scale: 1,
      easing: 'ease',
    }, { distance: `${offset * 2}px` }));

    ScrollReveal.reveal(this.para2, _.extend({
      origin: 'bottom',
      duration: 1000,
      delay: isSmall ? 0 : 300,
      distance: '0px',
      scale: 1,
      easing: 'ease',
    }, { distance: `${offset * 2}px` }));
  }

  render() {
    const isSmall = window.innerWidth < 640;
    const quote = isSmall ? (<p className="quote" ref={(c) => { this.para1 = c; }}>It was the best of times<br />It was the worst of times<br />
      It was the age of wisdom<br />It was the age of foolishness<br />
      It was the epoch of belief<br />It was the epoch of incredulity</p>)
      : (<p className="quote" ref={(c) => { this.para1 = c; }}>It was the best of times, it was the worst of times<br />
        It was the age of wisdom, it was the age of foolishness<br />
        It was the epoch of belief, it was the epoch of incredulity</p>);

    return (<section>
      <div className="wrapper mission" id="mission">
        {/*            <Element name="test1" className="element">element here</Element> */}
        <div className="horizontalWrapper">
          <Row type="flex" justify="center">
            <Col xs={20} sm={18}>
              {/* <h2 className="underscore">Our Mission</h2> */}
              {quote}

              <p ref={(c) => { this.para2 = c; }}>Coefficient Ventures is a multi-strategy crypto fund with strong presence in North America, Asia and Europe. We believe the revolution that blockchain brings us upon has just begun. The applications for blockchain technology are endless. We are proud to be part of this age, and are constantly seeking like-minds with passion and determination. Together, we change the world for the better.</p>
            </Col>
          </Row>
        </div>
      </div>
    </section>);
  }
}

MissionSection.propTypes = {
};

MissionSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default MissionSection;
