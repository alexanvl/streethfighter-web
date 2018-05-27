import React, { Component } from 'react';
import Layer2Lib from 'js-layer2lib';

import Lobby from './Lobby';
import Layer2libClient from '../../../utils/Layer2libClient';
import GlobalLayer2Lib from '../../../utils/GlobalLayer2Lib';

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
    const layer2lib = this.props.layer2libActions.init(myPrivateKey, myAccount);

    this.layer2libClient = new Layer2libClient(myAccount, layer2lib, this.props.firebaseActions.update, web3);
    GlobalLayer2Lib.client = this.layer2libClient;
    this.setState({ layer2Initialized: true, myAccount });
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
        startAgreement={this.layer2libClient.startAgreement}
        joinAgreement={this.layer2libClient.joinAgreement}
        updateAcceptedAgreement={this.layer2libClient.updateAcceptedAgreement}
        openChannel={this.layer2libClient.openChannel}
        joinChannel={this.layer2libClient.joinChannel}
        updateAcceptedChannel={this.layer2libClient.updateAcceptedChannel}
        sendUpdate={this.layer2libClient.sendUpdate}
        confirmUpdate={this.layer2libClient.confirmUpdate}
        updateConfirmedUpdate={this.layer2libClient.updateConfirmedUpdate}
      />}
      <a onClick={_ => this.props.history.push('/fight')}>hey</a>
    </div>
  }

}

export default injectRedux(Layer2LibTester);
