import React, { Component } from 'react';
import injectRedux from '../../components/lib/injectRedux';
import './styles.css';

export default injectRedux(
  class Login extends Component {
    initLayer2 = () => {
      this.props.gameActions.setAccount(this.refs.myAccountSelector.value);
      this.props.history.push('/lobby');
    }

    render() {
      const { gameActions } = this.props;
      return (
        <div className="container">
          <div style={{ marginBottom: "1em" }}>
            <img src="src/images/logo.png" alt="Streeth Fighter" height="200" width="200" />
          </div>
          <div style={{marginBottom: "1em"}}>
            My Account:
            <select ref='myAccountSelector'>
              {gameActions.getAccounts().map(account =>
                <option key={account}>
                  {account}
                </option>
              )}
            </select>
          </div>
          <button onClick={this.initLayer2}>Select</button>
        </div>
      )
    }
  }
);
