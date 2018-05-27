import * as hubAPI from './hubAPI'

class Layer2libClient {

  constructor(myAccount, layer2lib, firebaseUpdate, web3) {
    this.myAccount = myAccount;
    this.layer2lib = layer2lib;
    this.firebaseUpdate = firebaseUpdate;
    this.web3 = web3;
    this.myBalance = web3.toWei(0.1, 'ether');
    this.counterpartyBalace = web3.toWei(0.2, 'ether');
  }

  joinAgreement = async (agreement, state) => {
    console.log('Joining Agreement');
    const myAccount = this.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    let myAgreement = JSON.parse(JSON.stringify(agreement))

    await this.layer2lib.joinGSCAgreement(myAgreement, state)
    this.firebaseUpdate(`agreementProposal/${counterpartyAccount}`, { next: 'openChannel', event: 'updateAcceptedAgreement', agreement: myAgreement });
    console.log('Joined Agreement');
  }


  updateAcceptedAgreement = async agreement => {
    console.log('Updating Accepted Agreement');
    await this.layer2lib.gsc.updateAgreement(agreement);
    console.log('Updated Accepted Agreement');
  }

  startAgreement = async counterpartyAccount => {
    const myAccount = this.myAccount;
    this.layer2lib.initGSC()

    // clear database
    await this.layer2lib.gsc.clearStorage()

    let myAgreement = {
      ID: `agreement_${myAccount}${counterpartyAccount}`,
      types: ['Ether'],
      partyA: myAccount, // Viewer or performer public key
      partyB: counterpartyAccount, // Spank Hub public key
      balanceA: this.myBalance,
      balanceB: this.counterpartyBalace
    }

    let agreementId = myAgreement.ID

    await this.layer2lib.createGSCAgreement(myAgreement)

    let My_agreement = await this.layer2lib.getGSCAgreement(agreementId)
    let MyAgreementState = await this.layer2lib.gsc.getStates(agreementId)
    MyAgreementState = MyAgreementState[0]

    console.log('My agreement created and stored.. sending to other');
    this.firebaseUpdate(`agreementProposal/${counterpartyAccount}`, { next: 'joinAgreement', event: 'joinAgreement', state: MyAgreementState, agreement: myAgreement });
  }

  openChannel = async agreement => {
    console.log('Opening Channel');
    const myAccount = this.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    const ID = `channel_${myAccount}${counterpartyAccount}`;
    const agreementId = agreement.ID;
    let myChannel = {
      ID,
      agreementID: agreementId,
      type: 'ether',
      balanceA: this.web3.toWei(0.03, 'ether'),
      balanceB: this.web3.toWei(0.05, 'ether')
    }

    await this.layer2lib.openGSCChannel(myChannel)

    let My_chan = await this.layer2lib.gsc.getChannel(`${ID}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreementId}`)
    this.firebaseUpdate(`agreementProposal/${counterpartyAccount}`, { next: 'joinChannel', agreement: My_agreement, chan: My_chan });
    console.log('Opened Channel');
  }

  joinChannel = async (chan, agreement) => {
    console.log('Joining channel');
    const myAccount = this.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    const ID = chan.ID;
    const agreementId = agreement.ID;

    let myChan = JSON.parse(JSON.stringify(chan))
    let My_agreement = JSON.parse(JSON.stringify(agreement))
    await this.layer2lib.gsc.joinChannel(myChan, My_agreement, myChan.stateRaw)

    let My_chan = await this.layer2lib.gsc.getChannel(`${ID}`)
    My_agreement = await this.layer2lib.getGSCAgreement(`${agreementId}`)
    this.firebaseUpdate(`agreementProposal/${counterpartyAccount}`, { next: 'enterGame', chan: My_chan });
    console.log('Channel joined');
  }

  updateAcceptedChannel = async channel => {
    const myAccount = this.myAccount;

    await this.layer2lib.gsc.updateChannel(channel)
  }

  updateConfirmedUpdate = async (channel, agreement) => {
    const myAccount = this.myAccount;

    await this.layer2lib.gsc.updateAgreement(agreement)
    await this.layer2lib.gsc.updateChannel(channel)
  }

  sendUpdate = async (channel, agreement) => {
    console.log('You are initiating state update')

    const myAccount = this.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    let updateState = {
      isClose: 0,
      balanceA: this.web3.toWei(0.06, 'ether'),
      balanceB: this.web3.toWei(0.02, 'ether')
    }

    await this.layer2lib.gsc.initiateUpdateChannelState(channel.ID, updateState, false)

    const My_chan = await this.layer2lib.gsc.getChannel(`${channel.ID}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreement.ID}`)
    const MyChanState = await this.layer2lib.gsc.getStates(`${channel.ID}`)
    const MyAgreementState = await this.layer2lib.gsc.getStates(`${agreement.ID}`)

    console.log('Sending channel state update to counterparty')
    this.firebaseUpdate(`agreementProposal/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan, updateState });
  }

  confirmUpdate = async (channel, agreement, updateState) => {
    console.log('You are confirming state update')
    let myChannel = JSON.parse(JSON.stringify(channel))
    let myAgreement = JSON.parse(JSON.stringify(agreement))
    const myAccount = this.myAccount;
    const counterpartyAccount = (agreement.partyA === myAccount)? agreement.partyB : agreement.partyA;

    await this.layer2lib.gsc.confirmUpdateChannelState(myChannel, myAgreement, updateState)

    const My_chan = await this.layer2lib.gsc.getChannel(`${channel.ID}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreement.ID}`)
    const MyChanState = await this.layer2lib.gsc.getStates(`${channel.ID}`)
    const MyAgreementState = await this.layer2lib.gsc.getStates(`${agreement.ID}`)

    console.log('You confirmed channel state update, sending ack to counterparty')
    this.firebaseUpdate(`agreementProposal/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan, updateState });
  }

}

export default Layer2libClient;
