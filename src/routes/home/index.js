import React from 'react';
import { injectRedux } from '../../components';
import bgImage from './images/background.jpg';
import meta from './meta';
import styles from './styles';

export default injectRedux(props => {
  const {
    classes,
    firebaseActions,
    layer2libActions,
    history,
    location
  } = props;

  return (
    <div>
      Hello World
    </div>
  );
});