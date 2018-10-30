import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Layout, Menu, Icon, message, Button, Input, Row, Col, Tag } from 'antd';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import languageSwitcherActions from '../redux/languageSwitcher/actions';
import Dropdown, {
  DropdownMenu,
  MenuItem,
} from '../components/uielements/dropdown';

import { getCurrentTheme } from './ThemeSwitcher/config';
import { themeConfig } from '../config';
import IntlMessages from '../components/utility/intlMessages';

const { Header } = Layout;

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const items = [
  { path: '/', id: 'topbar.home' },
  { path: '/dice', id: 'topbar.dice' },
  { path: '/dealer', id: 'topbar.dealer' },
  { path: '/faq', id: 'topbar.faq' },
  { path: '/contact', id: 'topbar.contact' },
];

const langSettings = [
  {
    locale: 'en',
    key: 'english',
    imgSrc: '/images/flags/en.png',
    text: 'EN',
  },
  {
    locale: 'zh',
    key: 'chinese',
    imgSrc: '/images/flags/zh-cn.png',
    text: '中文',
  },
];

class Topbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.onLanguageDropdownClicked = this.onLanguageDropdownClicked.bind(this);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  onLanguageDropdownClicked({ key }) {
    const { changeLanguage } = this.props;
    changeLanguage(key);
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

    const { locale } = this.props;

    const btnClassName = `triggerBtn  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;
    const menuClassName = `menu  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;

    const languageDropdown = (
      <DropdownMenu onClick={this.onLanguageDropdownClicked}>

        {_.map(langSettings, (lang) => (
          <MenuItem key={lang.key}>
            <img src={lang.imgSrc} alt="" />
            <span style={{ paddingLeft: '12px' }}>
              {lang.text}
            </span>
          </MenuItem>
        ))}
      </DropdownMenu>
    );

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

                  {_.map(items, (item) => (<li className="hideOnMobile"><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>))}

                </ul>
              </div>
            </div>

            <div className={menuClassName} id="bs-example-navbar-collapse-1">
              <ul>
                {_.map(items, (item) => (<li role="menuitem"><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>))}
              </ul>
            </div>
            {/*            <div className="lang">
              <Dropdown overlay={languageDropdown}>
                <div className="selected">
                  <img src={_.find(langSettings, { locale }).imgSrc} alt="" />
                  <i className="fa fa-angle-down" />
                </div>
              </Dropdown>
            </div> */}
          </div>
        </Header>
      </div>
    );
  }
}

Topbar.propTypes = {
  locale: PropTypes.string,
  changeLanguage: PropTypes.func,
};

Topbar.defaultProps = {
  locale: 'en',
  changeLanguage: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
});

const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (lanId) => dispatch(languageSwitcherActions.changeLanguage(lanId)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
