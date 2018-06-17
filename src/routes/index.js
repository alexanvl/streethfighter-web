import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import injectAuthRequired from '../components/helpers/injectAuthRequired';

const Login = Loadable({
  loader: () => import('./login'),
  loading: () => null,
  delay: 500
});
const Lobby = Loadable({
  loader: () => import('./lobby'),
  loading: () => null,
  delay: 500
});
const Fight = Loadable({
  loader: () => import('./fight'),
  loading: () => null,
  delay: 500
});

export default (props) => {
  return (
    <div>
      <BrowserRouter >
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/lobby' component={injectAuthRequired(Lobby)} />
          <Route exact path='/fight' component={injectAuthRequired(Fight)} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
