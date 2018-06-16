import React, { Component } from 'react';
import { injectRedux } from '../lib';

export default (InnerComponent, redirectTo = '/') => {
  return injectRedux(
    class Wrapper extends Component {
      constructor(props) {
        super(props);

        this.state = {
          authCheck: false //assume
        };
      }

      componentWillMount() {
        const { firebaseActions, history } = this.props;

        firebaseActions.getUser().then((user) => {
          this.setState({ authCheck: true });

          if (user) {
            history.replace(redirectTo);
          }
        });
      }

      render() {
        return this.state.authCheck
          ? (<InnerComponent {...this.props} />) : (<div />);
      }
    }
  )
}
