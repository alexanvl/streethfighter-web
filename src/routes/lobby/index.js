import React, { Component } from 'react';
import injectRedux from '../../components/lib/injectRedux';
import './styles.css'

export default injectRedux(
  class Lobby extends Component {
    state = {
      showEnterGame: false
    }
    componentDidMount() {
      this.props.gameActions.listenLobbyOn();
    }

    componentWillUnmount() {
      this.props.gameActions.listenLobbyOff();
    }

    showEnterGame = _ => {
      this.setState({showEnterGame:true})
    }

    getLobbyRender = () => {
      const {
        gameReducer: { account, balances, lobby, proposal },
        layer2Actions
      } = this.props;
      const balance = balances[account] || 0;
      let jsx = (<h3>Please deposit ETH to play</h3>);

      if (balance > 0) {
        const lobbyUsers = lobby.map(user =>
          <div key={user.publicKey}>
            <div className="playerListItemContainer">
              {user.publicKey} with {balances[user.publicKey]} ETH
              <button
                style={{ float: "right", padding: "0 5px" }}
                onClick={_ => layer2Actions.createAgreement(
                  user.publicKey,
                  '0.01'
                )}
              >
                Create a Game (0.01 ETH)
              </button>
            </div>
          </div>
        );

        jsx = (
          <div>
            <h3>Currently in the lobby:</h3>
            {lobbyUsers}
            <h1>Join a game</h1>
            {proposal &&
              <div>
                from: {proposal.agreement.partyA}
                {proposal.next === 'joinAgreement' &&
                  proposal.agreement.openPending &&
                <button
                  onClick={_ =>
                    layer2Actions.joinAgreement(proposal.agreement, proposal.state[0])
                  }
                >
                  Join Game
                </button>}
                {proposal.next === 'openChannel' &&
                  !proposal.agreement.openPending &&
                <button
                  onClick={_ =>
                    layer2Actions.openChannel(proposal.agreement, '0.01')
                  }
                >
                  Open Channel
                </button>}
                {!this.state.showEnterGame &&
                  proposal.next === 'joinChannel' &&
                  proposal.agreement &&
                  proposal.channel &&
                <button
                  onClick={_ => {
                    this.showEnterGame();
                    layer2Actions.joinChannel(proposal.channel, proposal.agreement)
                  }}
                >
                  Join Channel
                </button>}
                {(this.state.showEnterGame || proposal.next === 'enterGame') &&
                  <button
                    onClick={_ => this.props.history.push('/fight')}
                  >
                    Enter Game
                  </button>}
              </div>}
          </div>
        );
      }

      return jsx;
    }

    render() {
      const { gameReducer: { account, balances } } = this.props;
      const balance = balances[account] || 0;

      return (
        <div className="container">
          <h1>Lobby</h1>
          <p style={{ marginBottom: "1em" }}>
            You are {account} with {balance} ETH
          </p>
          {this.getLobbyRender(balance)}
        </div>
      );
    }
  }
);
