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

const content = [{
  header: 'faq.account.header',
  body: [
  {
  title: 'faq.account.title.1',
  text: 'faq.account.text.1',
  },
  {
    title: 'faq.account.title.2',
    text: 'faq.account.text.2',
  }],
}, {
  header: 'faq.game.header',
  body: [{
    title: 'faq.game.title.1',
    text: 'faq.game.text.1',
  },
  {
    title: 'faq.game.title.2',
    text: 'faq.game.text.2',
  }],
}, {
  header: 'faq.fairness.header',
  body: [{
    title: 'faq.fairness.title.1',
    text: 'faq.fairness.text.1',
  },
  {
    title: 'faq.fairness.title.2',
    text: 'faq.fairness.text.2',
  }],
}, {
  header: 'faq.dividend.header',
  body: [{
    title: 'faq.dividend.title.1',
    text: 'faq.dividend.text.1',
  },
  {
    title: 'faq.dividend.title.2',
    text: 'faq.dividend.text.2',
  }],
}, {
  header: 'faq.token.header',
  body: [
    {
      title: 'faq.token.title.0',
      text: 'faq.token.text.0',
    },
  {
    title: 'faq.token.title.1',
    text: 'faq.token.text.1',
  },
  {
    title: 'faq.token.title.2',
    text: 'faq.token.text.2',
  },
  {
    title: 'faq.token.title.3',
    text: 'faq.token.text.3',
  },
  ],
},
{
  header: 'faq.bounty.header',
  body: [{
    title: 'faq.bounty.title.1',
    text: 'faq.bounty.text.1',
  },
  {
    title: 'faq.bounty.title.2',
    text: 'faq.bounty.text.2',
  },
  {
    title: 'faq.bounty.title.3',
    text: 'faq.bounty.text.3',
  },
  {
    title: 'faq.bounty.title.4',
    text: 'faq.bounty.text.4',
  },
  ],
}, {
  header: 'faq.profit.header',
  body: [{
    title: 'faq.profit.title.1',
    text: 'faq.profit.text.1',
  },
  {
    title: 'faq.profit.title.2',
    text: 'faq.profit.text.2',
  },
  {
    title: 'faq.profit.title.3',
    text: 'faq.profit.text.3',
  }],
}];


class FAQPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const { intl } = this.props;
    const {
    } = this.state;

    const termTextParts = intl.formatMessage({ id: "faq.term.body" }).split('\n');
    const termText =_.map(termTextParts, (part,partIndex)=><p key={partIndex}>{part}</p>);
    const termTextElement = <div className="page-term-body">{termText}</div>;


    return (
      <div id="faq-page">
        <div className="wrapper">
          <Row type="flex" justify="center">
            {/* <Col xs={24} sm={4}>
            <div className="container">
              <ul>
              {_.map(content, item=> (<li><IntlMessages id={item.header} /></li>))}
              </ul>
            </div>
          </Col>
          <Col xs={24} sm={20}>
            <div className="header">
            </div>
            <div className="body">
            {_.map(content, item=> (<div><h3><IntlMessages id="item.header" /></h3></div>
              ))}
            </div>
          </Col> */}
            <Col xs={24} md={20} xl={16}>
              <h1 className="page-title"><IntlMessages id="faq.title" /></h1>
            </Col>
            <Col xs={24} md={20} xl={16}>
              <Tabs
                defaultActiveKey="1"
                tabPosition="left"
                style={{}}
                className="faq-tabs"
                tabBarGutter={0}
              >

                {_.map(content, (item, index) => {
                  const body = _.map(item.body, (bodyItem, innerIndex) => 
                    {
                      const parts = intl.formatMessage({ id: bodyItem.text }).split('\n');
                      const text =_.map(parts, (part,partIndex)=><p key={partIndex}>{part}</p>);
                      return (<div key={innerIndex} style={{marginBottom: "24px"}}><h3>{<IntlMessages id={bodyItem.title} />}</h3>{text}</div>)
                    });
                  return (<TabPane tab={intl.formatMessage({ id: item.header })} key={index}><h2 className="tabpane-title">{intl.formatMessage({ id: item.header })}</h2>{body}</TabPane>);
                })}
              </Tabs>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} md={20} xl={16}>
              <div className="page-term">
              <h2 className="page-term-title"><IntlMessages id="faq.term.title" /></h2>
              {termTextElement}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

FAQPage.propTypes = {
  intl: intlShape.isRequired,
};

FAQPage.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FAQPage));
