/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import * as Scroll from 'react-scroll';
import moment from 'moment';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
const TabPane = Tabs.TabPane;
import IntlMessages from '../components/utility/intlMessages';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const {
  Link, Element, Events, scroll, scrollSpy,
} = Scroll;


class StakePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const { intl } = this.props;
    const {
    } = this.state;

    const termTextParts = intl.formatMessage({ id: 'stake.rule.body' }).split('\n');
    const termText = _.map(termTextParts, (part, partIndex) => <p key={partIndex}>{part}</p>);
    const termTextElement = <div className="page-term-body">{termText}</div>;

    return (
      <div id="faq-page">
        <div className="wrapper">
          <Row type="flex" justify="center">
            <Col xs={24} md={20} xl={16}>
              <h1 className="page-title"><IntlMessages id="stake.title" /></h1>
            </Col>
            <Col xs={24} md={20} xl={16}>
              <h3 className="page-title"><IntlMessages id="stake.subtitle" /></h3>
            </Col>
            <Col xs={24} md={20} xl={16}>
              <div className="contentWrapper">
                <div className="left">
                  <Row>
                  </Row>
                </div>
                <div className="right">
                  <Row>
                  </Row>
                </div>
              </div>
            </Col>

            <Col xs={24} md={20} xl={16}>
              <div className="page-term">
                <h2 className="page-term-title"><IntlMessages id="stake.rule.title" /></h2>
                {termTextElement}
              </div>
            </Col>

          </Row>
        </div>
      </div>
    );
  }
}

StakePage.propTypes = {
  intl: intlShape.isRequired,
};

StakePage.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StakePage));
