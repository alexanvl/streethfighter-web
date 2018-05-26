import React, { Component } from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import { injectRedux } from '../../components';
import bgImage from './images/background.jpg';
import meta from './meta';
import styles from './styles';

<<<<<<< HEAD
class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div className="rrs-container">
        <Spritesheet
          className={`my-element__class--style`}
          image={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-horizontal.png`}
          widthFrame={420}
          heightFrame={500}
          steps={14}
          fps={10}
          autoplay={true}
          loop={true}
        />
      </div>
    );
  }
}

export default injectRedux(Home);

=======
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
>>>>>>> 375de343b90c6602bc3ba03150820435f9207ca1
