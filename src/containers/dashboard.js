/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Scroll from 'react-scroll';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';

import InfoSection from '../components/sections/info';
import PortfolioSection from '../components/sections/portfolio';
import NewsSection from '../components/sections/news';
import StrengthSection from '../components/sections/strength';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const {
  Link: ScrollLink, Events, scroll, scrollSpy,
} = Scroll;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', (...rest) => {
      console.log('begin', rest);
    });

    Events.scrollEvent.register('end', (...rest) => {
      console.log('end', rest);
    });
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  // handleSetActive(to) {
  //   console.log(to);
  // }

  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 1,
      sm: 3,
      md: 3,
      lg: 4,
      xl: 4,
      xxl: 4,
    };
    const ROW_GUTTER = {
      xs: 0,
      sm: 16, // Set gutter to 16 + 8 * n, with n being a natural number
      md: 24,
      lg: 24,
      xl: 32,
      xxl: 32,
    };

    return (
      <div>
        <section style={{ height: '80vh' }}>
          <div className="head">

            <div className="content">
              <h1><Link to="/dice"><Button type="primary" size="large">Start Play Now</Button></Link></h1>
            </div>

            <div className="background">
            </div>

          </div>
        </section>

        {/*        <MissionSection />
*/}
        <StrengthSection />

        <PortfolioSection />

        {/* <TeamSection />

        <SectionAdvisor /> */}

        <NewsSection />

        <InfoSection />
      </div>
    );
  }
}

Dashboard.propTypes = {
};

Dashboard.defaultProps = {
};

// const mapStateToProps = (state) => ({
// });

// function mapDispatchToProps(dispatch) {
//   return {
//   };
// }

// Wrap the component to inject dispatch and state into it
export default connect(null, null)(Dashboard);
