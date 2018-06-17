import React from 'react';
import ReactDOM from 'react-dom';
import injectReduxProvider from './components/lib/injectReduxProvider'
import Routes from './routes';
import './styles.css';
//import { /*registerServiceWorker,*/ unregisterServiceWorker } from './utils';

const Injected = injectReduxProvider(Routes);

ReactDOM.render(
  <Injected />,
  document.getElementById('root'),
);

//unregisterServiceWorker();

