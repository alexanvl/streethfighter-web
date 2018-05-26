import React from 'react';
import ReactDOM from 'react-dom';
import { injectReduxProvider } from './components';
import Routes from './routes';
//import { /*registerServiceWorker,*/ unregisterServiceWorker } from './utils';

const Injected = injectReduxProvider(Routes);

ReactDOM.render(
  <Injected />,
  document.getElementById('root'),
);

//unregisterServiceWorker();

