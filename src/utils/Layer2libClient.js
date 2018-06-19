
class Layer2libClient {

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
      balanceA: this.web3.utils.toWei('0.06', 'ether'),
      balanceB: this.web3.utils.toWei('0.02', 'ether')
    }

    await this.layer2lib.gsc.initiateUpdateChannelState(channel.ID, updateState, false)

    const My_chan = await this.layer2lib.gsc.getChannel(`${channel.ID}`)
    const My_agreement = await this.layer2lib.getGSCAgreement(`${agreement.ID}`)
    const MyChanState = await this.layer2lib.gsc.getStates(`${channel.ID}`)
    const MyAgreementState = await this.layer2lib.gsc.getStates(`${agreement.ID}`)

    console.log('Sending channel state update to counterparty')
    this.firebaseUpdate(`game_proposals/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan, updateState });
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
    this.firebaseUpdate(`game_proposals/${counterpartyAccount}`, { agreement: My_agreement, chan: My_chan, updateState });
  }

}

export default Layer2libClient;
