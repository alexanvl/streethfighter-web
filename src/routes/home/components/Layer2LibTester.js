import React, { Component } from 'react';
import Layer2Lib from 'js-layer2lib';

import Lobby from './Lobby';
import Layer2libClient from '../../../utils/Layer2libClient';
import GlobalLayer2Lib from '../../../utils/GlobalLayer2Lib';

import { injectRedux } from '../../../components';

import { init } from '../../../store/actions/layer2lib';

const privateKeys = {
  '0x1e8524370B7cAf8dC62E3eFfBcA04cCc8e493FfE': '0x2c339e1afdbfd0b724a4793bf73ec3a4c235cceb131dcd60824a06cefbef9875',
  '0x4c88305c5f9e4feb390e6ba73aaef4c64284b7bc': '0xaee55c1744171b2d3fedbbc885a615b190d3dd7e79d56e520a917a95f8a26579',
  '0xd4EA3b21C312D7C6a1c744927a6F80Fe226A8416': '0x9eb0e84b7cadfcbbec8d49ae7112b25e0c1cb158ecd2160c301afa1f4a1029c8'
};

const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('https://rinkeby.infura.io'));

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
      <div style={{ marginBottom: "1em" }}>
        <img src="src/images/logo.png" alt="Streeth Fighter" height="200" width="200" />
      </div>
      {!layer2Initialized && <div><div style={{marginBottom: "1em"}}>
        My Account: <select ref='myAccountSelector'>
          {Object.keys(privateKeys).map(account => <option key={account}>
            {account}
          </option>)}
        </select>
      </div>
      <button onClick={this.initLayer2}>Select</button></div>}

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
    </div>
  }

}

export default injectRedux(Layer2LibTester);
