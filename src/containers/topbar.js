import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

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
import appActions from '../redux/app/actions';

const { Header } = Layout;
const { getIdentity } = appActions;

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const menuItems = [
  { path: '/', id: 'topbar.home' },
  // { path: '/dice', id: 'topbar.dice' },
  { path: '/stake', id: 'topbar.stake' },
  // { path: '/dealer', id: 'topbar.dealer' },
  { path: '/faq', id: 'topbar.faq' },
  // { path: '/contact', id: 'topbar.contact' },
  { url: 'https://res.cloudinary.com/forgelab-io/image/upload/v1542534137/BETX-whitepaper-1.0.pdf', id: 'topbar.whitepaper' },
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
      isLoggedIn: false,
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.onLanguageDropdownClicked = this.onLanguageDropdownClicked.bind(this);
    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { errorMessage, username } = nextProps;
    const { intl } = this.props;
    const { isLoggedIn } = this.state;

    if(username && !isLoggedIn){
      message.success(intl.formatMessage({ id: "topbar.message.welcome" }, {name:username}));

      // Make sure login in success only show up once
      this.setState({
        isLoggedIn: true,
      });
    }

    if (errorMessage) {
      switch (errorMessage) {
        case 'error.scatter.locked':
          const hide = message.loading(intl.formatMessage({ id: errorMessage }), 0);
          // Dismiss manually and asynchronously
          setTimeout(hide, 3000);
          break;

        default:
          message.error(intl.formatMessage({ id: errorMessage }));
          break;
      }
    }
  }


  componentDidMount() {
    // preload language flag img
    langSettings.forEach((item) => {
      document.createElement('img').src = item.imgSrc;
    });
  }

  onLanguageDropdownClicked({ key }) {
    const { changeLanguage } = this.props;
    console.log('onLanguageDropdownClicked.key', key);
    changeLanguage(key);
  }

  toggleCollapsed() {
    console.log('toggle', this.state.collapsed);

    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onLoginClicked() {
    const { getIdentityReq } = this.props;

    getIdentityReq();
  }

  render() {
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const {
      collapsed,
    } = this.state;

    const { locale, username } = this.props;

    const btnClassName = `triggerBtn  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;
    const menuClassName = `menu  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;

    const menuItemElements = _.map(menuItems, (item) => {
      if (item.url) {
        return <li className="hideOnMobile" key={item.id}><a href={item.url} target="_blank"><IntlMessages id={item.id} /></a></li>;
      }

      return <li className="hideOnMobile" key={item.id}><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>;
    });

    const menuItemElementsMobile = _.map(menuItems, (item) => {
      if (item.url) {
        return <li role="menuitem" key={item.id}><a href={item.url} target="_blank"><IntlMessages id={item.id} /></a></li>;
      }

      return <li role="menuitem" key={item.id}><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>;
    });

    const languageDropdown = (
      <Menu onClick={this.onLanguageDropdownClicked} className="lang-menu">
        {_.map(langSettings, (lang) => (
          <Menu.Item key={lang.key}>
            <img src={lang.imgSrc} alt="" />
            <span style={{ paddingLeft: '12px' }}>
              {lang.text}
            </span>
          </Menu.Item>
        ))}
      </Menu>
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
                      <CloudinaryImage publicId="betx-logo-gradient" options={{ height: 100, crop: 'scale' }} />
                    </Link>
                  </div>
                  <ul className="menu-list">
                    {menuItemElements}
                  </ul>
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

                  <li className="nav-btn" role="menuitem" key="login">
                    {username ? (<div className="message"><IntlMessages id="topbar.welcome"></IntlMessages><span>, {username}</span></div>) : <Button type="primary" size="large" onClick={this.onLoginClicked}><IntlMessages id="topbar.login" />
                    </Button>}
                  </li>
                  <li className="lang-menu-trigger" role="menuitem" key="lang">
                    <Dropdown overlay={languageDropdown}>
                      <div className="selected">
                        <img src={_.find(langSettings, { locale }).imgSrc} alt="" />
                        <i className="fa fa-angle-down" />
                      </div>
                    </Dropdown>
                  </li>
                </ul>
              </div>
            </div>

            <div className={menuClassName} id="bs-example-navbar-collapse-1">
              <ul>
                {menuItemElementsMobile}
              </ul>
            </div>

          </div>
        </Header>
      </div>
    );
  }
}

Topbar.propTypes = {
  locale: PropTypes.string,
  changeLanguage: PropTypes.func,
  getIdentityReq: PropTypes.func,
  username: PropTypes.string,
  errorMessage: PropTypes.string,
  intl: intlShape.isRequired,
};

Topbar.defaultProps = {
  locale: 'en',
  changeLanguage: undefined,
  getIdentityReq: undefined,
  username: undefined,
  errorMessage: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  username: state.App.get('username'),
  errorMessage: state.App.get('errorMessage'),
});

const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (lanId) => dispatch(languageSwitcherActions.changeLanguage(lanId)),
  getIdentityReq: () => dispatch(getIdentity()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Topbar));
