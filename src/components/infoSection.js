import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

class InfoSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (

      <section>
        <div className="wrapper dark info">
          <div className="horizontalWrapper">
            <Row>
              <Col
                xs={24}
                sm={8}
              >
                <ul>
                  <li><Link
                    to={{
                      pathname: '/',
                      hash: '#portfolio',
                    }}
                  >Portfolio</Link></li>
                  <li><Link
                    to={{
                      pathname: '/',
                      hash: '#team',
                    }}
                  ><h5>Team</h5></Link></li>
                  <li><h5>Partners</h5></li>
                  <li><h5>Become a partner</h5></li>
                </ul>
              </Col>
              <Col
                xs={24}
                sm={10}
              >
                <p>The Blockchain, a novel financial technology, holds the promise to disrupt legacy parts of financial services and create new markets. The firm has invested in 72 companies in the last three years, investing alongside Silicon Valley’s leading venture capital firms. </p>
              </Col>
              <Col
                xs={24}
                sm={6}
              >
                <ul>
                  <li><p>865 Market St</p></li>
                  <li><p>San Francisco CA, 94103</p></li>
                  <li><p>+1 (312) 912-5775</p></li>
                  <li><p>contract@bnf.capital</p></li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </section>
    );
  }
}

InfoSection.propTypes = {
};

InfoSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default InfoSection;
