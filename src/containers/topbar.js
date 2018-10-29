import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon, message, Button, Input, Row, Col, Tag } from 'antd';
import { cloudinaryConfig, CloudinaryImage, CloudinaryVideo } from '../components/react-cloudinary';

import { getCurrentTheme } from './ThemeSwitcher/config';
import { themeConfig } from '../config';

const { Header } = Layout;

cloudinaryConfig({ cloud_name: 'forgelab-io' });

class Topbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  toggleCollapsed() {
    console.log('toggle', this.state.collapsed);

    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const {
      collapsed,
    } = this.state;

    const btnClassName = `triggerBtn  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;
    const menuClassName = `menu  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;

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
                      <CloudinaryImage publicId="dice-logo" options={{ height: 100, crop: 'scale' }} />
                      <span>BETX Dice</span>
                    </Link>
                  </div>
                </div>

                <ul className="isoRight">
                  <div className="hideOnLarge">
                    <button
                      className={btnClassName}
                      style={{ color: customizedTheme.textColor }}
                      onClick={this.toggleCollapsed}
                      data-toggle="collapse"
                      data-target="#bs-example-navbar-collapse-1"
                    >
                      <span className="icon-bar top-bar"></span>
                      <span className="icon-bar middle-bar"></span>
                      <span className="icon-bar bottom-bar"></span>
                    </button>

                  </div>
                  <li className="hideOnMobile"><Link to="/" >Roadmap</Link></li>
                  <li className="hideOnMobile"><Link to="/faq" >FAQ</Link></li>
                  <li className="hideOnMobile"><Link to="/contact" >Contact</Link></li>
                </ul>
              </div>
            </div>

            <div className={menuClassName} id="bs-example-navbar-collapse-1">
              <ul>
                <li role="menuitem"><a href="/#">Roadmap</a></li>
                {/* <li role="menuitem"><a href="/#team">Team</a></li>
                <li role="menuitem"><a href="/#advisor">Advisor</a></li> */}
                {/* <li role="menuitem"><a href="/#partner">Partners</a></li> */}
                <li role="menuitem"><a href="/faq">FAQ</a></li>
                <li role="menuitem"><a href="/contact">Contact</a></li>
              </ul>
            </div>

          </div>
        </Header>
      </div>
    );
  }
}

Topbar.propTypes = {
};

Topbar.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
