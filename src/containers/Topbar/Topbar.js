import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Layout, Menu, Dropdown, Icon, message, Button, Input, Row, Col, Tag } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import appActions from '../../redux/app/actions';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const { Header } = Layout;


class Topbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const {
      collapsed,
    } = this.props;

    return (
      <div className="topbar">
        <Header
          style={{ background: 'transparent' }}
          className={collapsed ? 'collapsed' : ''}
        >
          <div className="cancel-ant-layout-header">
            <div className="horizontalWrapper">
              <div className="topbarWrapper">
                <div className="isoLeft">
                  <div className="logo-container" style={{ margin: '0px' }}>
                    <Link to="/">
                    </Link>
                  </div>
                </div>

                <ul className="isoRight">
                  <li><Link to="/" >Home</Link></li>
                  <li><Link to="/ecosystem" >Ecosystem</Link></li>
                  <li><Link to="/partner" >Become a partner</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </Header>
      </div>
    );
  }
}

Topbar.propTypes = {
  collapsed: PropTypes.bool,
};

Topbar.defaultProps = {
  collapsed: false,
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
