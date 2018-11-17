import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { ThemeProvider } from 'styled-components';
import appActions from '../../redux/app/actions';
import Topbar from '../topbar';
import AppRouter from './AppRouter';
import { AppLocale } from '../../index';
import themes from '../../config/themes';
import { themeConfig, siteConfig } from '../../config';
import AppHolder from './commonStyle';
import FooterComponent  from "../../components/footer";
const { Content, Footer } = Layout;
const { toggleAll } = appActions;

export class App extends React.PureComponent {
  render() {
    const {
      match: { url }, locale, toggleAll,
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
                <Debounce time="1000" handler="onResize">
                  <WindowResizeListener
                    onResize={(windowSize) =>
                      toggleAll(
                        windowSize.windowWidth,
                        windowSize.windowHeight
                      )}
                  />
                </Debounce>
                <Topbar url={url} />
                <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                  <Layout>
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
  toggleAll: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};

export default connect(
  (state) => ({
    auth: state.Auth,
    locale: state.LanguageSwitcher.language.locale,
  }),
  { toggleAll }
)(App);
