import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

import { injectRedux } from '../../../components';

class Lobby extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  updateLobby = lobby => {
    this.setState({ lobby });
  }

  updateProposal = proposal => {
    this.setState({ proposal });
    if(proposal && proposal.agreement) {
      window.whichParty = (proposal.agreement.partyA === window.myAccount)? 'B' : 'A';
    }
  }

  updateTimeout = _ => {
    const myLobbyEntry = {};
    myLobbyEntry[this.props.myAccount] = { publicKey: this.props.myAccount, timestamp: Date.now() };
    this.props.firebaseActions.update('lobby', myLobbyEntry);
    this.setState({ lastUpdate: Date.now() })
    setTimeout(this.updateTimeout, 5000);
  }

  componentDidMount() {
    this.props.firebaseActions.listenOn('lobby', this.updateLobby);
    this.props.firebaseActions.listenOn(`agreementProposal/${this.props.myAccount}`, this.updateProposal);
    this.updateTimeout();
  }
  showEnterGame = _ => {
    this.setState({showEnterGame:true})
  }

  render() {
    const { lobby = [], lastUpdate, proposal } = this.state;
    const { myAccount } = this.props;
    const users = _.filter(lobby, player => {
      const recent = player.timestamp > Date.now() - 10000;
      const isMe = player.publicKey === myAccount;
      return recent && !isMe;
    });
    return <div>
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
        {proposal.next === 'joinAgreement' && proposal.agreement.openPending && <button onClick={_ => this.props.joinAgreement(proposal.agreement, proposal.state)}>Join Game</button>}
        {false && !proposal.agreement.openPending && <button onClick={_ => this.props.updateAcceptedAgreement(proposal.agreement)}>Update Agreement</button>}
        {proposal.next === 'openChannel' && !proposal.agreement.openPending && <button onClick={_ => this.props.openChannel(proposal.agreement)}>Open Channel</button>}
        {!this.state.showEnterGame && proposal.next === 'joinChannel' && proposal.agreement && proposal.chan && <button onClick={_ => {this.showEnterGame(); this.props.joinChannel(proposal.chan, proposal.agreement)}}>Join Channel</button>}
        {false && proposal.chan && !proposal.chan.openPending && <button onClick={_ => this.props.updateAcceptedChannel(proposal.chan)}>Update Accepted Channel</button>}
        {false && proposal.chan && <button onClick={_ => this.props.sendUpdate(proposal.chan, proposal.agreement)}>Send Update</button>}
        {false && proposal.chan && <button onClick={_ => this.props.confirmUpdate(proposal.chan, proposal.agreement, proposal.updateState)}>Confirm Update</button>}
        {false && proposal.chan && <button onClick={_ => this.props.updateConfirmedUpdate(proposal.chan, proposal.agreement)}>Update Confirmed Update</button>}
        {(this.state.showEnterGame || proposal.next === 'enterGame') && <button onClick={_ => this.props.enterGame()}>Enter Game</button>}
      </div>}
    </div>;
  }

}

export default injectRedux(Lobby);
