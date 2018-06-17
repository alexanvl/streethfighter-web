import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import injectRedux from '../../components/lib/injectRedux';
import './styles.css'

export default injectRedux(
  class Lobby extends Component {
    state = {
      proposal: null
    };
    interval = null;

    componentDidMount() {
      const { account } = this.props.gameReducer;
      this.props.firebaseActions.listenOn('lobby', this.updateLobby);
      this.props.firebaseActions.listenOn(
        `agreementProposal/${account}`, this.updateProposal
      );
      this.updateTimeout();
    }

    componentWillUnmount() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    }

    updateLobby = lobby => {
      this.setState({ lobby });
    }

    updateProposal = proposal => {
      const { account } = this.props.gameReducer;

      this.setState({ proposal });

      if(proposal && proposal.agreement) {

        window.whichParty = (proposal.agreement.partyA === window.myAccount)? 'B' : 'A';
      }
    }

    updateTimeout = () => {
      const {
        firebaseActions,
        gameReducer: { account }
      } = this.props;

      if (!this.interval) {
        this.interval = setInterval(this.updateTimeout, 5000);
      }

      if (account) {
        const myLobbyEntry = {
          [account]: { publicKey: account, timestamp: Date.now() }
        };
        firebaseActions.update('lobby', myLobbyEntry);
        this.setState({ lastUpdate: Date.now() })
      }
    }

    showEnterGame = _ => {
      this.setState({showEnterGame:true})
    }

    render() {
      const { lobby = [], lastUpdate, proposal, myAccount } = this.state;
      const users = _.filter(lobby, player => {
        const recent = player.timestamp > Date.now() - 10000;
        const isMe = player.publicKey === myAccount;
        return recent && !isMe;
      });
      return <div className="container">
        <h1>Lobby</h1>
        <p>(Last updated {moment(lastUpdate).fromNow()})</p>
        <p style={{ marginBottom: "1em" }}>You are {myAccount}</p>
        <h3>Currently in the lobby</h3>
        {_.map(users, user => <div key={user.publicKey}>
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
