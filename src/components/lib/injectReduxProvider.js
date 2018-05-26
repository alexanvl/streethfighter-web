import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../store';

export default (InnerComponent, initialState) => {
  const store = configureStore(initialState || undefined);

  return (props) => {
    return (
      <Provider store={store}>
        <InnerComponent />
      </Provider>
    );
  };
}
