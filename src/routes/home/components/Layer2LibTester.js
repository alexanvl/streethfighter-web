import React, { Component } from 'react';
import Layer2Lib from 'js-layer2lib';

import Lobby from './Lobby';

import { injectRedux } from '../../../components';

import { init } from '../../../store/actions/layer2lib';

const privateKeys = {
  '0x47f5744364871e442967ef9624d0e5b6d867ad50': '0x6cb2b4257e4477b096beacc755b6abf45d9d67738522aa27d3c2e1444eb4ea80',
  '0x52721196a9bfd4ecb2ecbec8122183f59cfdb201': '0x7d62b5a4caa26ff7833a37c1b0b3cf2ead49d9942f4ed940c54d9d70275b4591',
  '0xd156363d387d6a7350f3f40d353eba7912cfacb7': '0x7942483b9ba28f92c2cb4014104c5629de7a41c56ebd832377ca3a4950459c2e'
};

const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const myBalance = web3.toWei(0.1, 'ether');
const counterpartyBalace = web3.toWei(0.2, 'ether');

class Layer2LibTester extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  initLayer2 = _ => {
    const myAccount = this.refs.myAccountSelector.value;
    const myPrivateKey = privateKeys[myAccount];
    this.layer2lib = this.props.layer2libActions.init(myPrivateKey, myAccount);
    this.setState({ layer2Initialized: true, myAccount });
  }

  joinAgreement = async (agreement, state) => {
    console.log('Joining Agreement');
    const myAccount = this.state.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    let myAgreement = JSON.parse(JSON.stringify(agreement))
    myAgreement.dbSalt = this.state.myAccount

    await this.layer2lib.joinGSCAgreement(myAgreement, state)
    this.setState({
      myAgreement
    })
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { event: 'updateAcceptedAgreement', agreement: myAgreement });
    console.log('Joined Agreement');
  }


  updateAcceptedAgreement = async agreement => {
    console.log('Updating Accepted Agreement');
    const myAgreement = Object.assign({}, agreement, { dbSalt: this.state.myAccount});
    await this.layer2lib.gsc.updateAgreement(myAgreement);
    this.setState({
      myAgreement
    })
    console.log('Updated Accepted Agreement');
  }

  startAgreement = async counterpartyAccount => {
    const myAccount = this.state.myAccount;
    this.layer2lib.initGSC()

    // clear database
    await this.layer2lib.gsc.clearStorage()

    let myAgreement = {
      dbSalt: myAccount, // for testing multiple layer2 instances on same db
      ID: `agreement_${myAccount}${counterpartyAccount}`,
      types: ['Ether'],
      partyA: myAccount, // Viewer or performer public key
      partyB: counterpartyAccount, // Spank Hub public key
      balanceA: myBalance,
      balanceB: counterpartyBalace
    }

    let agreementId = myAgreement.ID + myAgreement.dbSalt

    await this.layer2lib.createGSCAgreement(myAgreement)

    let My_agreement = await this.layer2lib.getGSCAgreement(agreementId)
    let MyAgreementState = await this.layer2lib.gsc.getStates(agreementId)
    MyAgreementState = MyAgreementState[0]

    console.log('My agreement created and stored.. sending to other');
    this.setState({
      myAgreement
    })
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { event: 'joinAgreement', state: MyAgreementState, agreement: myAgreement });
  }

  openChannel = async agreement => {
    console.log('Opening Channel');
    const myAccount = this.state.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    const dbSalt = myAccount;
    const ID = `channel_${myAccount}${counterpartyAccount}`;
    const agreementId = agreement.ID;
    let myChannel = {
      dbSalt, // for testing multiple layer2 instances on same db
      ID,
      agreementID: agreementId,
      type: 'ether',
      balanceA: web3.toWei(0.03, 'ether'),
      balanceB: web3.toWei(0.05, 'ether')
    }

    await this.layer2lib.openGSCChannel(myChannel)

    let My_chan = await this.layer2lib.gsc.getChannel(`${ID}${dbSalt}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreementId}${dbSalt}`)
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan });
    console.log('Opened Channel');
  }

  joinChannel = async (chan, agreement) => {
    console.log('Joining channel');
    const myAccount = this.state.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    const dbSalt = myAccount;
    const ID = chan.ID;
    const agreementId = agreement.ID;

    let myChan = JSON.parse(JSON.stringify(chan))
    myChan.dbSalt = dbSalt
    let My_agreement = JSON.parse(JSON.stringify(agreement))
    My_agreement.dbSalt = dbSalt
    await this.layer2lib.gsc.joinChannel(myChan, My_agreement, myChan.stateRaw)

    let My_chan = await this.layer2lib.gsc.getChannel(`${ID}${dbSalt}`)
    My_agreement = await this.layer2lib.getGSCAgreement(`${agreementId}${dbSalt}`)
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { chan: My_chan });
    console.log('Channel joined');
  }

  updateAcceptedChannel = async channel => {
    const myAccount = this.state.myAccount;
    const dbSalt = myAccount;
    channel.dbSalt = dbSalt
    await this.layer2lib.gsc.updateChannel(channel)
  }

  updateConfirmedUpdate = async (channel, agreement) => {
    const myAccount = this.state.myAccount;
    const dbSalt = myAccount;
    agreement.dbSalt = dbSalt
    channel.dbSalt = dbSalt
    await this.layer2lib.gsc.updateAgreement(agreement)
    await this.layer2lib.gsc.updateChannel(channel)
  }

  sendUpdate = async (channel, agreement) => {
    console.log('You are initiating state update')

    const myAccount = this.state.myAccount;
    const dbSalt = myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    let updateState = {
      isClose: 0,
      balanceA: web3.toWei(0.06, 'ether'),
      balanceB: web3.toWei(0.02, 'ether')
    }

    await this.layer2lib.gsc.initiateUpdateChannelState(channel.ID, updateState, false)

    const My_chan = await this.layer2lib.gsc.getChannel(`${channel.ID}${dbSalt}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreement.ID}${dbSalt}`)
    const MyChanState = await this.layer2lib.gsc.getStates(`${channel.ID}${dbSalt}`)
    const MyAgreementState = await this.layer2lib.gsc.getStates(`${agreement.ID}${dbSalt}`)

    console.log('Sending channel state update to counterparty')
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan, updateState });
  }

  confirmUpdate = async (channel, agreement, updateState) => {
    console.log('You are confirming state update')
    let myChannel = JSON.parse(JSON.stringify(channel))
    let myAgreement = JSON.parse(JSON.stringify(agreement))
    const myAccount = this.state.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;
    const dbSalt = myAccount;
    myChannel.dbSalt = dbSalt
    myAgreement.dbSalt = dbSalt

    await this.layer2lib.gsc.confirmUpdateChannelState(myChannel, myAgreement, updateState)

    const My_chan = await this.layer2lib.gsc.getChannel(`${channel.ID}${dbSalt}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreement.ID}${dbSalt}`)
    const MyChanState = await this.layer2lib.gsc.getStates(`${channel.ID}${dbSalt}`)
    const MyAgreementState = await this.layer2lib.gsc.getStates(`${agreement.ID}${dbSalt}`)

    console.log('You confirmed channel state update, sending ack to counterparty')
    this.props.firebaseActions.update(`agreementProposal/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan, updateState });
  }

  render() {
    const { layer2Initialized, myAccount } = this.state;
    return <div>
      {!layer2Initialized && <div><div>
        My Account: <select ref='myAccountSelector'>
          {web3.eth.accounts.slice(0,3).map(account => <option key={account}>
            {account}
          </option>)}
        </select>
      </div>
      <button onClick={this.initLayer2}>initLayer2</button></div>}

      {layer2Initialized && <Lobby myAccount={this.state.myAccount}
        startAgreement={this.startAgreement}
        joinAgreement={this.joinAgreement}
        updateAcceptedAgreement={this.updateAcceptedAgreement}
        openChannel={this.openChannel}
        joinChannel={this.joinChannel}
        updateAcceptedChannel={this.updateAcceptedChannel}
        sendUpdate={this.sendUpdate}
        confirmUpdate={this.confirmUpdate}
        updateConfirmedUpdate={this.updateConfirmedUpdate}
      />}
      {this.state.agreement && !this.state.agreement.openPending && <div><h1>Channel Stuff</h1>
      <div>
        <button onClick={_ => this.props.openChannel()}>Open Channel</button>
      </div></div>}
    </div>
  }

}

export default injectRedux(Layer2LibTester);
