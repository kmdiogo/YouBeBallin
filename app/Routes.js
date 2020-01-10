import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './views/App';
import HomePage from './views/HomePage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
