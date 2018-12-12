/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tabs, Collapse } from 'antd';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import IntlMessages from '../components/utility/intlMessages';

const { TabPane } = Tabs;
const { Panel } = Collapse;

cloudinaryConfig({ cloud_name: 'forgelab-io' });

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
  },
  {
    title: 'faq.dividend.title.3',
    text: 'faq.dividend.text.3',
    imgId: 'betx/daily-divid',
    imgOptions: { height: 80, crop: 'scale' },
  },
  {
    title: 'faq.dividend.title.4',
    text: 'faq.dividend.text.4',
    imgId: 'betx/first-divid',
    imgOptions: { height: 80, crop: 'scale' },
  },
  {
    title: 'faq.dividend.title.5',
    text: 'faq.dividend.text.5',
    imgId: 'betx/faq-timeline',
  },
  ],
}, {
  header: 'faq.token.header',
  body: [
    {
      title: 'faq.token.title.0',
      text: 'faq.token.text.0',
    },
    {
      title: 'faq.token.title.2',
      text: 'faq.token.text.2',
      imgId: 'betx/token-distribution',
    },
    {
      title: 'faq.token.title.3',
      text: 'faq.token.text.3',
      imgId: 'betx/mining-efficiency',
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
    const { intl, view, locale } = this.props;

    const termTextParts = intl.formatMessage({ id: 'faq.term.body' }).split('\n');
    const termText = _.map(termTextParts, (part, partIndex) => <p key={partIndex}>{part}</p>);
    const termTextElement = <div className="page-term-body"><div className="page-term-body-inner panel normal-font">{termText}</div></div>;

    let faqElements;

    if (_.isUndefined(view)) {
      return null;
    } else if (view === 'MobileView') {
      faqElements =
      (<Collapse accordion className="faq-collapse-mobile">
        {_.map(content, (item, index) => {
          const body = _.map(item.body, (bodyItem, innerIndex) => {
            const parts = intl.formatMessage({ id: bodyItem.text }).split('\n');
            const text = _.map(parts, (part, partIndex) => <p key={partIndex}>{part}</p>);
            const img = bodyItem.imgId && <div className="faq-img"><CloudinaryImage publicId={`${bodyItem.imgId}-${locale}`} options={bodyItem.imgOptions} /></div>;

            return (<div key={innerIndex} style={{ marginBottom: '12px' }}><h3>{<IntlMessages id={bodyItem.title} />}</h3>{text}{img}</div>);
          });
          return (<Panel header={intl.formatMessage({ id: item.header })} key={index}>
            <h2 className="tabpane-title">{intl.formatMessage({ id: item.header })}</h2>
            {body}
          </Panel>);
        })}
      </Collapse>);
    } else {
      faqElements = (<Tabs
        defaultActiveKey="1"
        tabPosition="left"
        style={{}}
        className="faq-tabs"
        tabBarGutter={0}
      >
        {_.map(content, (item, index) => {
          const body = _.map(item.body, (bodyItem, innerIndex) => {
            const parts = intl.formatMessage({ id: bodyItem.text }).split('\n');
            const text = _.map(parts, (part, partIndex) => <p key={partIndex}>{part}</p>);
            const img = bodyItem.imgId && <div><CloudinaryImage publicId={`${bodyItem.imgId}-${locale}`} options={bodyItem.imgOptions} /></div>;
            return (<div key={innerIndex} style={{ marginBottom: '24px' }}><h3>{<IntlMessages id={bodyItem.title} />}</h3>{text}{img}</div>);
          });
          return (<TabPane tab={intl.formatMessage({ id: item.header })} key={index}><h2 className="tabpane-title">{intl.formatMessage({ id: item.header })}</h2>{body}</TabPane>);
        })}

      </Tabs>
      );
    }

    const colWidth = {
      xs: 24,
      xl: 20,
      xxl: 16,
    };

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
            <Col {...colWidth}>
              <h1 className="page-title"><IntlMessages id="faq.title" /></h1>
            </Col>
            <Col {...colWidth}>
              {faqElements}
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col {...colWidth}>
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
  view: PropTypes.string,
  locale: PropTypes.string,
};

FAQPage.defaultProps = {
  view: undefined,
  locale: 'en',
};

const mapStateToProps = (state) => ({
  view: state.App.get('view'),
  locale: state.LanguageSwitcher.language.locale,
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, null)(injectIntl(FAQPage));
