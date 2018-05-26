import React, { Component } from 'react';
import Layer2Lib from 'js-layer2lib';

import { injectRedux } from '../../../components';

import { init } from '../../../store/actions/layer2lib';

const privateKey = '0x6cb2b4257e4477b096beacc755b6abf45d9d67738522aa27d3c2e1444eb4ea80';

const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const myName = 'Alice';
const myAccount = web3.eth.accounts[0];
const counterpartyAccount = web3.eth.accounts[1];
const myBalance = web3.toWei(0.1, 'ether');
const counterpartyBalace = web3.toWei(0.2, 'ether');

class Layer2LibTester extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.layer2lib = this.props.layer2libActions.init(privateKey);
  }

  joinAgreement = async (counterPartyAgreement, CounterPartyAgreementState) => {
    let myAgreement = JSON.parse(JSON.stringify(counterPartyAgreement))
    myAgreement.dbSalt = myName

    await this.layer2lib.joinGSCAgreement(myAgreement, CounterPartyAgreementState)
    this.setState({
      myAgreement
    })
    //TODO: do send myAgreement
  }


  updateAcceptedAgreement = async updatedAgreement => {
    const myAgreement = Object.assign({}, updatedAgreement, { dbSalt: 'Alice'});
    await this.layer2lib.updateAgreement(myAgreement);
    this.setState({
      myAgreement
    })
  }

  startAgreement = async _ => {

      this.layer2lib.initGSC()

      // clear database
      await this.layer2lib.gsc.clearStorage()

      let myAgreement = {
        dbSalt: myName, // for testing multiple layer2 instances on same db
        ID: 'spankHub1337',
        types: ['Ether'],
        partyA: myAccount, // Viewer or performer public key
        partyB: counterpartyAccount, // Spank Hub public key
        balanceA: myBalance,
        balanceB: counterpartyBalace
      }

      let entryID = myAgreement.ID + myAgreement.dbSalt

      await this.layer2lib.createGSCAgreement(myAgreement)

      let My_agreement = await this.layer2lib.getGSCAgreement(entryID)
      //console.log(col)
      let My_tx = await this.layer2lib.gsc.getTransactions(entryID)
      //console.log(Alice_tx)
      let MyAgreementState = await this.layer2lib.gsc.getStates('spankHub1337Alice')
      //Grab the latest (currently only state in list)
      MyAgreementState = MyAgreementState[0]
      //console.log(AliceAgreementState)

      console.log('My agreement created and stored.. sending to other');
      this.setState({
        myAgreement
      })
      //TODO: do send
  }

  render() {
    return <div>
      <button onClick={this.startAgreement}>Start Agreement</button>
      <button onClick={this.joinAgreement}>Join Agreement</button>
      <div>
        <h1>My agreement details:</h1>
        <pre>{JSON.stringify(this.state.myAgreement, undefined, 2)}</pre>
      </div>
    </div>;
  }

}

export default injectRedux(Layer2LibTester);
