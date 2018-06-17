import React, { Component } from 'react';
import injectRedux from '../lib/injectRedux';

export default (InnerComponent) => {
  return injectRedux(
    class Wrapper extends Component {
      state = {
        authed: false,
      }

      setAuthed = props => {
        // const { firebaseActions, history, location: { pathname  } } = props;

        // firebaseActions.getUser().then((user) => {
        //   if (!user) {
        //     history.replace('/login', { from: pathname });
        //   } else {
        //     this.setState({ authed: true });
        //   }
        // });
        // for now just check account set
        const { gameReducer: { account }, history } = props

        if (!account) {
          history.replace('/login');
        } else {
          this.setState({ authed: true });
        }
      };

      componentWillMount() {
        this.setAuthed(this.props);
      }

      componentWillReceiveProps(nextProps) {
        this.setAuthed(nextProps);
      }

      render() {
        return this.state.authed
          ? (<InnerComponent {...this.props} />) : (<div />);
      }
    }
  );
}
