import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Layout, Menu, Dropdown, Icon, message, Button, Input, Row, Col, Tag } from 'antd';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';

import appActions from '../redux/app/actions';
import { getCurrentTheme } from './ThemeSwitcher/config';
import { themeConfig } from '../config';

const { Header } = Layout;

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

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
      toggleCollapsed,
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
                      <CloudinaryImage publicId="logo-black_gntesu" options={{ width: 150, crop: 'scale' }} />
                    </Link>
                  </div>
                </div>

                <ul className="isoRight">
                  <button
                    className={
                      collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
                    }
                    style={{ color: customizedTheme.textColor }}
                    onClick={toggleCollapsed}
                  />
                  <li><Link to="/" >Home</Link></li>
                  {/* <li><Link to="/ecosystem" >Ecosystem</Link></li> */}
                  <li><Link to="/contact" >Become a partner</Link></li>
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
  toggleCollapsed: PropTypes.func,
};

Topbar.defaultProps = {
  collapsed: false,
  toggleCollapsed: undefined,
};

const mapStateToProps = (state) => ({
  collapsed: state.App.collapsed,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCollapsed: () => dispatch(appActions.toggleCollapsed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
