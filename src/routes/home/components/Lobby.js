import React, { Component } from 'react';
import _ from 'lodash';

import { injectRedux } from '../../../components';

class Lobby extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  updateLobby = lobby => {
    this.setState({ lobby });
  }

  updateTimeout = _ => {
    const myLobbyEntry = {};
    myLobbyEntry[this.state.myPublicKey] = { publicKey: this.state.myPublicKey, timestamp: Date.now() };
    this.props.firebaseActions.update('lobby', myLobbyEntry);
    this.setState({ lastUpdate: Date.now() })
    setTimeout(this.updateTimeout, 5000);
  }

  componentDidMount() {
    const myLobbyEntry = {};
    const myPublicKey = (Math.random()*1000000 + '').slice(0,3);
    this.props.firebaseActions.listenOn('lobby', this.updateLobby);
    this.setState({ myPublicKey }, this.updateTimeout);
  }

  render() {
    const { lobby = [], myPublicKey, lastUpdate } = this.state;
    const users = _.filter(lobby, player => player.timestamp > Date.now() - 10000);
    return <div>
      <h1>Lobby (You are {myPublicKey} and updated at {lastUpdate})</h1>
      {_.map(users, user => <div key={user.publicKey}>
        {user.publicKey}
      </div>)}
    </div>;
  }

}

export default injectRedux(Lobby);
