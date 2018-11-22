/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Icon, Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
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

    return (
      <div id="faq-page">
        <div className="wrapper">
          <Row type="flex" justify="center">
            <Col xs={24} md={20} xl={16}>
              <h1 className="page-title"><IntlMessages id="stake.title" /></h1>
            </Col>
            <Col xs={24} md={20} xl={16} className='border-bottom'>
              <h3 className="page-sub-title"><IntlMessages id="stake.dividend.rest" />({<Icon type="clock-circle" />} <span style={{color:'white',letterSpacing:2}}>00:39:16</span>)</h3>
            </Col>
            <Col xs={24} md={20} xl={16}>
              <Row gutter={90}>
                <Col xs={24} md={12} className='page-dividend border-right'>
                  <Row  gutter={50} type='flex' justify='center' align='middle'>
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.dividend.total" /></p>
                      <div className="page-third-title panel" style={{padding:20}}>
                      <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                      1887.4841 EOS
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.dividend.allday" /></p>
                      <div className="page-third-title panel" style={{padding:20}}>
                      <div><CloudinaryImage publicId="eos-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                      1887.4841 EOS</div>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={24} className='border-bottom text-left'>
                    <div className='page-sub-title'><IntlMessages id="stake.dividend.my" /></div>
                    </Col>
                    <Col span={24}>
                    <div className="page-dividend-detail panel-trans">
                      <Row className='border-bottom'>
                        <Col span={12}>
                          <p className='page-third-title' style={{marginTop:19}}><IntlMessages id="stake.income.predicate" /></p>
                          <p className='page-third-title' style={{color:'white'}}>0.0000002156 EOS</p>
                        </Col>
                        <Col span={12}>
                          <p className='page-third-title' style={{marginTop:19}}><IntlMessages id="stake.income.betx" /></p>
                          <p className='page-third-title' style={{color:'white'}}>0.000002156 EOS</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='page-third-title text-right' span={6}><IntlMessages id="stake.income.rest" /></Col>
                        <Col span={2} style={{marginTop:12}}><CloudinaryImage publicId="eos-logo-grey" options={{ height: 30, crop: 'scale' }} /></Col>
                        <Col className='page-third-title text-left' style={{color:"white"}} span={10}>0.00003156 EOS</Col>
                        <Col className='getStake-btn-holder' span={6}><Button className='getStake-btn'><IntlMessages id="stake.income.get"/></Button></Col>
                      </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} md={12} style={{marginTop:30}}>
                  <Row  gutter={50} type='flex' justify='center' align='middle'>
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.betx.pledge" /></p>
                      <div className="page-third-title panel" style={{padding:20}}>
                      <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                      1887.4841 EOS
                      </div>
                    </Col>
                    <Col span={12}>
                      <p className="page-sub-title"><IntlMessages id="stake.betx.circulate" /></p>
                      <div className="page-third-title panel" style={{padding:20}}>
                      <div><CloudinaryImage publicId="betx-logo-grey" options={{ height: 40, crop: 'scale' }} /></div>
                      1887.4841 EOS</div>
                    </Col>
                  </Row>
                  <Row className='pledge-container' >
                    <Col span={24} style={{marginTop:30, marginBottom:40, paddingBottom:10}} className='border-bottom text-left'><span className='page-sub-title'><IntlMessages id="stake.token.pledge" /></span></Col>
                    <Col span={24} className='panel-trans'>
                      <Row>
                        <Col span={12} className='border-right'>
                          <Row style={{padding:20}}>
                            <Col span={24} className='page-third-title text-left'><IntlMessages id="stake.token.betx" /></Col>
                            <Col span={24} className='page-third-title panel-trans'>
                              <Row>
                                <Col span={4}><CloudinaryImage style={{marginTop:5}} publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></Col>
                                <Col span={14}><Input className='clear-input pledge-input' value={4000} ></Input></Col>
                                <Col span={4}><Button className='clear-btn pledge-btn'><IntlMessages id="stake.action.pledge" /></Button></Col>
                              </Row>
                            </Col>
                            <Col span={24} className='page-third-title' style={{color:'white'}}>
                              <Row type='flex' justify='space-around' align='middle'>
                                <Col className='text-left' span={12}><IntlMessages id="stake.available" /></Col>
                                <Col className='text-right' span={12}>5324236 BETX</Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12}>
                        <Row style={{padding:20}}>
                            <Col span={24} className='page-third-title text-left'><IntlMessages id="stake.betx.redemption" /></Col>
                            <Col span={24} className='page-third-title panel-trans'>
                              <Row>
                                <Col span={4}><CloudinaryImage style={{marginTop:5}} publicId="betx-logo-grey" options={{ height: 30, crop: 'scale' }} /></Col>
                                <Col span={14}><Input className='clear-input pledge-input' value={4000} ></Input></Col>
                                <Col span={4}><Button className='clear-btn pledge-btn'><IntlMessages id="stake.action.redemption" /></Button></Col>
                              </Row>
                            </Col>
                            <Col span={24} className='page-third-title' style={{color:'white'}}>
                              <Row type='flex' justify='space-around' align='middle'>
                                <Col className='text-left' span={12}><IntlMessages id="stake.available" /></Col>
                                <Col className='text-right' span={12}>5324236 BETX</Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={20} xl={16}>
              <div className="page-term">
                <h2 className="page-sub-title"><IntlMessages id="stake.rule.title" /></h2>
                <div className="page-term-body">
                <div className="page-term-body-inner panel">{termText}</div>
                </div>
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
