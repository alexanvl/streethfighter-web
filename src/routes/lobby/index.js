import React, { Component } from 'react';
import injectRedux from '../../components/lib/injectRedux';
import './styles.css'

export default injectRedux(
  class Lobby extends Component {
    state = {
      showEnterGame: false,
      loading: false
    }
    componentDidMount() {
      this.props.gameActions.listenLobbyOn();
      window.onbeforeunload = () => {
        this.props.gameActions.listenLobbyOff();
      };
    }

    componentWillUnmount() {
      this.props.gameActions.listenLobbyOff();
    }

    getLobbyRender = () => {
      const {
        gameReducer: { account, balances, lobby, proposal },
        layer2Actions
      } = this.props;
      const { loading } = this.state;
      const balance = balances[account] || 0;
      let jsx = (<h3>Please deposit ETH to play</h3>);

      if (balance > 0) {
        const lobbyUsers = lobby.map(user =>
          <div key={user.publicKey}>
            <div className="playerListItemContainer">
              {user.publicKey} with {balances[user.publicKey]} ETH
              <button
                style={{ float: "right", padding: "0 5px" }}
                onClick={() => {
                  if (!loading && !proposal) {
                    this.setState({ loading: true });
                    layer2Actions.createAgreement(
                      user.publicKey,
                      '0.01'
                    ).then(() => this.setState({ loading: false }))
                  }
                }}
              >
                {loading || proposal ? 'Game Pending...' : 'Create a Game (0.01 ETH))'}
              </button>
            </div>
          </div>
        );

        jsx = (
          <div>
            <h3>Currently in the lobby:</h3>
            {lobbyUsers}
            {proposal && !loading && <h1>Game proposal</h1>}
            {proposal && loading && <h1>Loading...</h1>}
            {proposal &&
              <div>
                from: {proposal.agreement.partyA}
                {proposal.next === 'joinAgreement' &&
                  proposal.agreement.openPending &&
                  !loading &&
                <button
                  onClick={() => {
                    this.setState({ loading: true });
                    layer2Actions.joinAgreement(
                      proposal.agreement,
                      proposal.state[0]
                    ).then(() => this.setState({ loading: false }))
                  }}
                >
                  Join Game
                </button>}
                {proposal.next === 'openChannel' &&
                  !proposal.agreement.openPending &&
                  !loading &&
                <button
                  onClick={() => {
                    this.setState({ loading: true });
                    layer2Actions.openChannel(proposal.agreement, '0.01')
                      .then(() => this.setState({ loading: false }))
                  }}
                >
                  Open Channel
                </button>}
                {!this.state.showEnterGame &&
                  proposal.next === 'joinChannel' &&
                  proposal.agreement &&
                  proposal.channel &&
                  !loading &&
                <button
                onClick={() => {
                    this.setState({ loading: true });
                    layer2Actions.joinChannel(proposal.channel, proposal.agreement)
                      .then(() => this.setState({ loading: false, showEnterGame: true }))
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
