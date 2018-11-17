import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import {siteConfig} from "../settings";

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      <div id="footer">
          <span>{siteConfig.footerText}</span>
      </div>
    );
  }
}

Footer.propTypes = {
};

Footer.defaultProps = {
};

export default Footer;

