/* eslint no-restricted-globals: ["off", "location"], react/no-string-refs: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { Layout, Menu, message, Button, Modal } from 'antd';

import Dropdown from '../components/uielements/dropdown';
import { cloudinaryConfig, CloudinaryImage } from '../components/react-cloudinary';
import languageSwitcherActions from '../redux/languageSwitcher/actions';
import StatsWidget from '../components/statsWidget';

import { getCurrentTheme } from './ThemeSwitcher/config';
import { themeConfig } from '../config';
import IntlMessages from '../components/utility/intlMessages';
import appActions from '../redux/app/actions';
import { parseQuery } from '../helpers/utility';

const { Header } = Layout;
const { getIdentity, setRef } = appActions;

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const menuItems = [
  { path: '/', id: 'topbar.home' },
  // { path: '/dice', id: 'topbar.dice' },
  { path: '/stake', id: 'topbar.stake' },
  // { path: '/dealer', id: 'topbar.dealer' },
  { path: '/faq', id: 'topbar.faq' },
  // { path: '/contact', id: 'topbar.contact' },
  { url: 'https://res.cloudinary.com/forgelab-io/image/upload/v1542534137/BETX-whitepaper-1.0.pdf', id: 'topbar.whitepaper' },
  // Referrals
  { id: 'topbar.referrals' },
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
      refModalVisible: false,
      languageDropdown: null,
    };

    this.location = window.location;

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.selectedMenu = this.selectedMenu.bind(this);

    this.onLanguageDropdownClicked = this.onLanguageDropdownClicked.bind(this);
    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  componentWillMount() {
    const languageDropdown = (
      <Menu onClick={this.onLanguageDropdownClicked} className="lang-menu">
        {_.map(langSettings, (lang) => (
          <Menu.Item key={lang.key} className="lang-menu-item">
            <img src={lang.imgSrc} alt="" />
            <span style={{ paddingLeft: '12px' }}>
              {lang.text}
            </span>
          </Menu.Item>
        ))}
      </Menu>
    );
    this.setState({
      languageDropdown,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { errorMessage, username } = nextProps;
    const { intl } = this.props;
    const { isLoggedIn } = this.state;

    if (username && !isLoggedIn) {
      message.success(intl.formatMessage({ id: 'topbar.message.welcome' }, { name: username }));

      // Make sure login in success only show up once
      this.setState({
        isLoggedIn: true,
      });
    }

    if (errorMessage) {
      switch (errorMessage) {
        case 'error.scatter.locked':
        { const hide = message.loading(intl.formatMessage({ id: errorMessage }), 0);
          // Dismiss manually and asynchronously
          setTimeout(hide, 3000);
          break; }

        default:
          message.error(intl.formatMessage({ id: errorMessage }));
          break;
      }
    }
  }

  componentDidMount() {
    const { setRefReq } = this.props;
    const { search } = this.location;

    // preload language flag img
    langSettings.forEach((item) => {
      document.createElement('img').src = item.imgSrc;
    });

    const queryParams = parseQuery(search);

    if (queryParams && queryParams.ref) {
      setRefReq(queryParams.ref);
    }
  }

  onLanguageDropdownClicked({ key }) {
    const { changeLanguage } = this.props;
    changeLanguage(key);
  }

  toggleCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  selectedMenu() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onLoginClicked(evt) {
    evt.preventDefault();
    const { getIdentityReq } = this.props;

    getIdentityReq();
  }

  setRefModalVisible(refModalVisible) {
    this.setState({
      refModalVisible,
      collapsed: true,
    });
  }

  render() {
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const {
      collapsed,
    } = this.state;

    const {
      locale, username, isTopbarTransparent,
    } = this.props;

    const btnClassName = `triggerBtn  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;
    const menuClassName = `menu  ${collapsed ? 'menuCollapsed' : 'menuOpen'}`;

    const referralLink = `${this.location.protocol}//${this.location.hostname}?ref=${username || ''}`;

    const menuItemElements = _.map(menuItems, (item) => {
      if (item.url) {
        return <li className="hideOnMobile" key={item.id}><a href={item.url} target="_blank"><IntlMessages id={item.id} /></a></li>;
      } else if (item.path) {
        return <li className="hideOnMobile" key={item.id}><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>;
      }
      return <li className="hideOnMobile" key={item.id}><a href={item.url} onClick={() => this.setRefModalVisible(true)} target="_blank"><IntlMessages id={item.id} /></a></li>;
    });

    const menuItemElementsMobile = _.map(menuItems, (item) => {
      if (item.url) {
        return <li role="menuitem" key={item.id}><a href={item.url} onClick={this.selectedMenu} target="_blank"><IntlMessages id={item.id} /></a></li>;
      } else if (item.path) {
        return <li role="menuitem" key={item.id}><Link to={item.path} onClick={this.selectedMenu} ><IntlMessages id={item.id} /></Link></li>;
      }
      return <li role="menuitem" key={item.id}><a href={item.url} onClick={() => this.setRefModalVisible(true)} target="_blank"><IntlMessages id={item.id} /></a></li>;
    });
    menuItemElementsMobile.push(<li role="menuitem" key="login"><a href={null} style={{ width: '100%' }} onClick={this.onLoginClicked}><IntlMessages id="topbar.login" /></a></li>);
    /*
    const languageDropdown = (
            <Menu onClick={this.onLanguageDropdownClicked} className="lang-menu">
              {_.map(langSettings, (lang) => (
                <Menu.Item key={lang.key} className="lang-menu-item">
                  <img src={lang.imgSrc} alt="" />
                  <span style={{ paddingLeft: '12px' }}>
                    {lang.text}
                  </span>
                </Menu.Item>
              ))}
            </Menu>
          );
     */
    const topbarClassname = classNames({
      topbar: true,
      transparent: isTopbarTransparent,
    });

    return (
      <div className={topbarClassname}>
        <Header>
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

                  <li className="nav-btn" role="menuitem" key="stats">
                    <StatsWidget />
                  </li>

                  <li className="nav-btn hideOnMobile" role="menuitem" key="login">
                    {username ? (<div className="message"><IntlMessages id="topbar.welcome"></IntlMessages><span>{username}</span></div>) : <Button type="primary" size="large" onClick={this.onLoginClicked}><IntlMessages id="topbar.login" />
                    </Button>}
                  </li>
                  <li role="menuitem" key="lang">
                    <div className="lang-menu-trigger">
                      <Dropdown overlay={this.state.languageDropdown}>
                        <div className="selected">
                          <div className="selected-inner">
                            <img src={_.find(langSettings, { locale }).imgSrc} alt="" />
                            <i className="fa fa-angle-down" />
                          </div>
                        </div>
                      </Dropdown>
                      <div className="vertical-align-helper" />
                    </div>
                  </li>
                  <li>
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
                      <div className="vertical-align-helper" />
                    </div>
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

        {/* Ref Modal */}
        <Modal
          className="refModal"
          title={<IntlMessages id="topbar.copy.title" />}
          centered
          visible={this.state.refModalVisible}
          onOk={() => this.setRefModalVisible(false)}
          onCancel={() => {
            this.setRefModalVisible(false);
            this.refs.refText.style.background = 'transparent';
          }}
          footer={null}
        >
          <div className="refmodal-container">
            <div className="refmodal-container-input">
              <div><span ref="refText">{referralLink}</span></div>
              <div>
                <CopyToClipboard
                  text={referralLink}
                  onCopy={() => {
                    this.refs.refText.style.background = 'blue';
                  }}
                >
                  <Button size="large" type="primary"><IntlMessages id="topbar.copy" /></Button>
                </CopyToClipboard>
              </div>
            </div>
            <div>
              <span><IntlMessages id="topbar.copy.description" /></span></div>
          </div>
        </Modal>
      </div>
    );
  }
}

Topbar.propTypes = {
  locale: PropTypes.string,
  changeLanguage: PropTypes.func,
  getIdentityReq: PropTypes.func,
  setRefReq: PropTypes.func,
  username: PropTypes.string,
  errorMessage: PropTypes.string,
  intl: intlShape.isRequired,
  isTopbarTransparent: PropTypes.bool.isRequired,
};

Topbar.defaultProps = {
  locale: 'en',
  changeLanguage: undefined,
  getIdentityReq: undefined,
  setRefReq: undefined,
  username: undefined,
  errorMessage: undefined,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  username: state.App.get('username'),
  errorMessage: state.App.get('errorMessage'),
  isTopbarTransparent: state.App.get('isTopbarTransparent'),
});

const mapDispatchToProps = (dispatch) => ({
  setRefReq: (ref) => dispatch(setRef(ref)),
  changeLanguage: (lanId) => dispatch(languageSwitcherActions.changeLanguage(lanId)),
  getIdentityReq: () => dispatch(getIdentity()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Topbar)));
