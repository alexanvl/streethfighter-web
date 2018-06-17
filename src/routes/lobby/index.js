import React, { Component } from 'react';
import injectRedux from '../../components/lib/injectRedux';
import './styles.css'

export default injectRedux(
  class Lobby extends Component {
    componentDidMount() {
      this.props.gameActions.listenLobbyOn();
    }

    componentWillUnmount() {
      this.props.gameActions.listenLobbyOff();
    }

    showEnterGame = _ => {
      this.setState({showEnterGame:true})
    }

    render() {
      const {
        gameReducer: { account, lobby, proposal }
      } = this.props;
      return <div className="container">
        <h1>Lobby</h1>
        <p style={{ marginBottom: "1em" }}>You are {account}</p>
        <h3>Currently in the lobby</h3>
        {lobby.map(user =>
          <div key={user.publicKey}>
            <div className="playerListItemContainer">
              {user.publicKey}
              <button style={{ float: "right", padding: "0 5px"}}
                onClick={_ => this.props.startAgreement(user.publicKey)}>
                Create a game
              </button>
            </div>
          </div>)}
        <h1>Join a game</h1>
        {proposal && <div>
          from: {proposal.agreement.partyA}
          {proposal.next === 'joinAgreement' &&
            proposal.agreement.openPending &&
            <button
              onClick={_ =>
                this.props.joinAgreement(proposal.agreement, proposal.state)
              }
            >
              Join Game
            </button>}
          {proposal.next === 'openChannel' &&
            !proposal.agreement.openPending &&
            <button onClick={_ =>
              this.props.openChannel(proposal.agreement)}
            >
              Open Channel
            </button>
          }
          {!this.state.showEnterGame &&
            proposal.next === 'joinChannel' &&
            proposal.agreement &&
            proposal.chan &&
            <button
              onClick={_ => {
                this.showEnterGame();
                this.props.joinChannel(proposal.chan, proposal.agreement)
              }
            }>
              Join Channel
            </button>}
          {(this.state.showEnterGame || proposal.next === 'enterGame') &&
            <button
              onClick={_ => this.props.history.push('/fight')}
            >
              Enter Game
            </button>}
        </div>}
      </div>;
    }
  }
);
