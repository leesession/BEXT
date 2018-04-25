import React, { PropTypes } from 'react';
import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';

import InfoSection from '../components/sections/info';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });


class Jobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <section>
          <div className="wrapper jobs">
            <div className="horizontalWrapper">
              <h2 className="underscore">Jobs</h2>
              <Row type="flex" justify="center">
                <Col span={24}>
                  <div className="postWrapper">
                    <div className="title">
                      <h2>Associate Partner</h2>
                      <h3>San Francisco California, Full Time</h3>
                    </div>
                    <div className="body">
                      <p>Coefficient Ventures is a multi-strategy crypto fund with strong presence in North America, Asia and Europe. Founded in 2017, it has invested in 30+ projects including Filecoin, Raiden, Zeppelin, Urbit, Tari, Thunder, Nucypher and Keep. Founding partner Chance Du is advisor of Tomo, IoTex and Havven, guest lecturer at Stanford Beyond Bitcoin class as well as a thought leader in global conferences.</p>
                      <p>We are hiring an associate partner to work with the core team at San Francisco or remotely. You will be an integral part of our team, tasked with blockchain project research and analysis, deal sourcing, event organizing and marketing.</p>
                      <p><strong>About the role:</strong></p>
                      <ul>
                        <li>Interpret and extract key information of deals and generate concise report.</li>
                        <li>Arrange meetings with projects and partners for collaboration while promoting the venture’s mission and values.</li>
                        <li>Capable of writing high quality reports on blockchain and cryptocurrency markets and technology.</li>
                        <li>Maintain pipeline and portfolio management processes, tools and deal tracking.</li>
                        <li>Advise in negotiating, structuring and executing investments, working with the Managing Partner.</li>
                        <li>Portfolio company monitoring, reporting and provide feedback to Managing Partners.</li>
                      </ul>
                      <p><strong>About you:</strong></p>
                      <ul>
                        <li>Passionate about blockchain space and own crypto currencies.</li>
                        <li>Capacity to take ownership of projects.</li>
                        <li>Strong written and verbal communication skills.</li>
                        <li>Genuine curiosity/understanding of cryptocurrency/blockchain technologies.</li>
                        <li>A degree in Math, CS, Economics, Physics, Statistics, or Engineering, or be able to demonstrate deep understanding of the technologies that underpin digital assets (public key cryptography, distributed systems, consensus mechanisms).</li>
                      </ul>
                      <p><strong>Highly desirable:</strong></p>
                      <ul>
                        <li>Startup or entrepreneurial company experience.</li>
                        <li>Self-confident, self-motivated and highly-organized with a strong sense of personal accountability.</li>
                      </ul>
                      <p><strong>Perks of being a unique part of Coefficient Ventures:</strong></p>
                      <ul>
                        <li><strong>The forefront of a revolution.</strong> At Coefficient we fundamentally believe that a next generation of technologies presents the opportunity to create a more just and equitable society.</li>
                        <li><strong>A decentralized startup environment.</strong> Coefficient is a thought leader in the blockchain space and we are absorbing a significant portion of the mindshare. This is both exciting and challenging, as we learn to scale our organization while adhering to the principles of decentralization.</li>
                        <li><strong>Continuous learning.</strong> You’ll be constantly exposed to new languages, frameworks and ideas from your peers and as you work on different projects -- challenging you to stay at the top of your game.</li>
                        <li><strong>Deep technical challenges.</strong> This entire ecosystem is about 10 years old. Ethereum itself is still a toddler. There is much work to be done before these platforms can scale to the order of millions or billions of users. Coefficient is building the technology platforms that can get us to those next thresholds of scale.</li>
                      </ul>

                      <p>This is a 6-week internship with the opportunity to be hired full-time upon completion. Through the 6 weeks candidates are paid hourly and performance is reviewed on a weekly basis. We are hoping you are the best opportunity for hire.</p>
                      <p>If you feel like you are a good fit, you must include any relevant projects, LinkedIn, and your cover letter where you tell us a little about yourself and why you think you’d be a great addition to our team!</p>
                      <p>Please contact us at <a href="mailto:info@coefficientventures.com?Subject=Coefficient+Application%3A+Associate+Partner" target="_top">info@coefficientventures.com</a></p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </section>

        <InfoSection />
      </div>
    );
  }
}

Jobs.propTypes = {
};

Jobs.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default Jobs;
