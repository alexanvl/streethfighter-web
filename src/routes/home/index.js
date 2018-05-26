import React, { Component } from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import { injectRedux } from '../../components';
import bgImage from './images/background.jpg';
import meta from './meta';
import styles from './styles';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
        <Spritesheet
          image={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-horizontal.png`}
          widthFrame={420}
          heightFrame={500}
          steps={14}
          fps={10}
          autoplay={true}
          loop={true}
        />
    );
  }
}

export default injectRedux(Home);

