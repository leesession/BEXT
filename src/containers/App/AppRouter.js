import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    let { url } = this.props;

    // Remove trailing '/' from url so that we can use `${url}/topic` below
    if (url[url.length - 1] === '/') {
      url = url.slice(0, url.length - 1);
    }

    return (
      <Switch>
        <Route
          exact
          path={`${url}/`}
          component={asyncComponent(() => import('../dice'))}
        />
        <Route
          exact
          path={`${url}/dice`}
          component={asyncComponent(() => import('../dice'))}
        />
        <Route
          exact
          path={`${url}/stake`}
          component={asyncComponent(() => import('../stake'))}
        />
        <Route
          exact
          path={`${url}/faq`}
          component={asyncComponent(() => import('../faq'))}
        />
      </Switch>
    );
  }
}

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
