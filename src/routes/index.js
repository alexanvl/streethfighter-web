import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { injectAuthRedirect, injectAuthRequired } from '../components';
import Home from './home';
import Fight from './fight';

export default (props) => {
  return (
    <div>
      <BrowserRouter >
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/fight' component={Fight} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
