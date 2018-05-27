import React, { Component } from 'react';
import Layer2LibTester from './components/Layer2LibTester';
import { injectRedux } from '../../components';
// import styles from './styles';
import './style.css';
// import signup from './components/Signup';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
        <div className="layer2LobbyContainer">
          <Layer2LibTester history={this.props.history} />
        </div>
    );
  }
}

export default injectRedux(Home);
