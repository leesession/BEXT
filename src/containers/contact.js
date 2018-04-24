import React, { PropTypes } from 'react';
import { Form, Input, Row, Col } from 'antd';
import _ from 'lodash';

import ContactForm from '../components/contactForm';
import InfoSection from '../components/sections/info';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

const FormItem = Form.Item;

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>

        <section>
          <div className="wrapper contact">
            <div className="horizontalWrapper">
              <h2 className="underscore">Become a Partner</h2>
              <p></p>
              <Row type="flex" justify="center">
                <Col span={16}>
                  <ContactForm />
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

Contact.propTypes = {
};

Contact.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default Contact;
