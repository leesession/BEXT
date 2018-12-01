import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import WindowSizeListener from 'react-window-size-listener'

import { ThemeProvider } from 'styled-components';
import Waypoint from 'react-waypoint';

import appActions from '../../redux/app/actions';
import Topbar from '../topbar';
import AppRouter from './AppRouter';
import { AppLocale } from '../../index';
import themes from '../../config/themes';
import { themeConfig, siteConfig } from '../../config';
import AppHolder from './commonStyle';
import FooterComponent from '../../components/footer';
const { Content, Footer } = Layout;
const { toggleAll, toggleTopbar } = appActions;

export class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onWaypointLeave = this.onWaypointLeave.bind(this);
    this.onWaypointEnter = this.onWaypointEnter.bind(this);
  }

  onWaypointLeave({ currentPosition, previousPosition, waypointTop }) {
    const { toggleTopbarReq } = this.props;
    if (currentPosition === Waypoint.above) {
      toggleTopbarReq(false);
    }
  }

  onWaypointEnter({ currentPosition, previousPosition, waypointTop }) {
    const { toggleTopbarReq } = this.props;

    if (currentPosition === Waypoint.inside) {
      toggleTopbarReq(true);
    }
  }


  render() {
    const {
      match: { url }, locale, toggleAllReq,
    } = this.props;

    const currentAppLocale = AppLocale[locale];
    const appHeight = window.innerHeight;


    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <ThemeProvider theme={themes[themeConfig.theme]}>
            <AppHolder>
              <Layout style={{ height: appHeight }}>
                  <WindowSizeListener
                    onResize={(windowSize) =>
                      toggleAllReq(
                        windowSize.windowWidth,
                        windowSize.windowHeight
                      )}
                  />
                <Topbar url={url} />
                <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                  <Layout>
                    <Waypoint onEnter={this.onWaypointEnter} onLeave={this.onWaypointLeave} />
                    <Content
                      style={{
                        flexShrink: '0',
                      }}
                    >
                      <AppRouter url={url} />
                    </Content>
                    <Footer>
                      <FooterComponent />
                    </Footer>
                  </Layout>
                </Layout>
              </Layout>
            </AppHolder>
          </ThemeProvider>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

App.propTypes = {
  toggleAllReq: PropTypes.func.isRequired,
  toggleTopbarReq: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};

App.defaultProps = {
};

const mapStateToProps = (state) => ({
  locale: state.LanguageSwitcher.language.locale,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAllReq: (width, height) => dispatch(toggleAll(width, height)),
  toggleTopbarReq: (isTransparent) => dispatch(toggleTopbar(isTransparent)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
