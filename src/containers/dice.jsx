/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Scroll from 'react-scroll';
import moment from 'moment';

import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';

import InfoSection from '../components/sections/info';
import Slider from '../components/slider';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { TabPane } = Tabs;

const {
  Link, Element, Events, scroll, scrollSpy,
} = Scroll;


class DicePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [{
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
      }, {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
      }],
    };

    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',


    }];

    this.onTabClicked = this.onTabClicked.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
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
  onTabClicked() {

  }

  onInputNumberChange() {

  }

  render() {
    const { columns } = this;
    const { dataSource } = this.state;

    return (
      <div id="dicepage">
        <section>
          <div className="horizontalWrapper">

            <div className="container">
              <div className="action">
                <Row type="flex" gutter={36}>
                  <Col span={12}>
                    <div className="inputgroup">
                      <span className="label">Bet Amount</span>
                      <InputGroup compact>
                        <Button size="large" type="default">1/2
                        </Button>
                        <Button size="large" type="default">2X
                        </Button>
                        <Button size="large" type="default">MAX
                        </Button>
                        <InputNumber size="large" defaultValue="1" onChange={this.onInputNumberChange} />
                      </InputGroup>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="box">
                      <span className="label">Payout on win
                      </span>
                      <div className="value">
                      </div>
                    </div>
                  </Col>

                  <Col span={24}>
                    <Row type="flex">
                      <Col span={8}>
                        <div className="box">
                          <span className="label">Roll under to win
                          </span>
                          <div className="value">50↓
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="box">
                          <span className="label">Payout
                          </span>
                          <div className="value">2.00x
                          </div>
                        </div>

                      </Col>
                      <Col span={8}>
                        <div className="box">
                          <span className="label">Win chance
                          </span>
                          <div className="value">49%
                          </div>
                        </div>
                      </Col>


                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row type="flex">
                      <Col span={8}>
                      </Col>
                      <Col span={8}>
                        <Button className="button" size="large" type="primary">Login</Button>
                      </Col>
                      <Col span={8}>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="history">
                <Row type="flex" justify="center">
                  <Col span={12}>
                    <Slider />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </section>

        <section >
          <div className="horizontalWrapper">

            <Tabs defaultActiveKey="1" onChange={this.onTabClicked} size="large">
              <TabPane tab="All Bets" key="1">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  bordered
                  showHeader
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="My Bets" key="2">Content of Tab Pane 2</TabPane>
              <TabPane tab="Huge Wins" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>


          </div>
        </section>

        <InfoSection />
      </div>
    );
  }
}

DicePage.propTypes = {
};

DicePage.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(DicePage);
