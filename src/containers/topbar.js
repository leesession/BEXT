import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { Layout, Menu, Icon, message, Button, Input, Row, Col, Tag, Modal } from 'antd';
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
  { id:'topbar.referrals'}
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
      refModalVisible: false,
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.onLanguageDropdownClicked = this.onLanguageDropdownClicked.bind(this);
    this.onLoginClicked = this.onLoginClicked.bind(this);
    
    this.refLoc = this.props.location.search && parseQuery(this.props.location.search).ref;
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { errorMessage } = nextProps;
    const { intl } = this.props;

    if (errorMessage) {
      message.error(intl.formatMessage({ id: errorMessage }));
    }
  }


  componentDidMount() {
    // preload language flag img
    langSettings.forEach((item) => {
      document.createElement('img').src = item.imgSrc;
    });
    
    if(this.refLoc) this.props.setRefAction(this.refLoc);
    
  }

  componentWillReceiveProps(nextProps) {
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
  
  setRefModalVisible(refModalVisible) {
    this.setState({ refModalVisible });
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
      }else if(item.path){
        return <li className="hideOnMobile" key={item.id}><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>;
      }else{
        return <li className="hideOnMobile" key={item.id}><a href={item.url} onClick={() => this.setRefModalVisible(true)} target="_blank"><IntlMessages id={item.id} /></a></li>;
      }
    });

    const menuItemElementsMobile = _.map(menuItems, (item) => {
      if (item.url) {
        return <li role="menuitem" key={item.id}><a href={item.url} target="_blank"><IntlMessages id={item.id} /></a></li>;
      }else if(item.path){
        return <li role="menuitem"  key={item.id}><Link to={item.path} ><IntlMessages id={item.id} /></Link></li>;
      }else{
        return <li role="menuitem"  key={item.id}><a href={item.url} onClick={() => this.setRefModalVisible(true)} target="_blank"><IntlMessages id={item.id} /></a></li>;
      }
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
                    {username ? (<IntlMessages id="topbar.welcome"> {username}</IntlMessages>) : <Button type="primary" size="large" onClick={this.onLoginClicked}><IntlMessages id="topbar.login" />
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
        
        {/* Ref Modal */}
        <Modal
          className='refModal'
          title={<IntlMessages id="topbar.copy.title"/>}
          style={{ top: '40vh'}}
          centered
          visible={this.state.refModalVisible}
          onOk={() => this.setRefModalVisible(false)}
          onCancel={() => {
            this.setRefModalVisible(false);
            this.refs.refText.style.background = 'transparent';
          }}
          footer={null}
        >
          <Row type='flex' gutter={20} justify='center' align='middle'>
             <Col span={18} style={{marginBottom:20}}><div className='refWraper'><span className='refHolder' ref='refText'>{this.props.location.href}</span></div></Col>
             <Col span={6} style={{marginBottom:20}}>
             <CopyToClipboard text={this.props.location.href} onCopy={()=>{
               this.refs.refText.style.background = 'blue';
             }}>
             <Button style={{width:'100%', fontSize:'1.2em'}} size='large' type="primary"><IntlMessages id="topbar.copy"/></Button>
             </CopyToClipboard>
             </Col>
             <Col span={24} style={{fontSize:'1.2em'}}><span><IntlMessages id="topbar.copy.description"/></span></Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

Topbar.propTypes = {
  locale: PropTypes.string,
  changeLanguage: PropTypes.func,
  getIdentityReq: PropTypes.func,
  setRefAction: PropTypes.func,
  username: PropTypes.string,
  errorMessage: PropTypes.string,
  intl: intlShape.isRequired,
  location: PropTypes.object.isRequired,
};

Topbar.defaultProps = {
  locale: 'en',
  changeLanguage: undefined,
  getIdentityReq: undefined,
  setRefAction: undefined,
  username: undefined,
  errorMessage: undefined,
  location: window.location,
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
  username: state.App.get('username'),
  errorMessage: state.App.get('errorMessage'),
});

const mapDispatchToProps = (dispatch) => ({
  setRefAction: (ref) => dispatch(setRef(ref)),
  changeLanguage: (lanId) => dispatch(languageSwitcherActions.changeLanguage(lanId)),
  getIdentityReq: () => dispatch(getIdentity()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Topbar));
