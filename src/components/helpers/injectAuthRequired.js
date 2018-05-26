import React, { Component } from 'react';
import { injectRedux } from '../lib';

export default (InnerComponent) => {
  return injectRedux(
    class Wrapper extends Component {
      constructor(props) {
        super(props);

        this.state = {
          authed: false,
        };
      }

      setAuthed = (props) => {
        const { firebaseActions, history, location: { pathname  } } = props;

        firebaseActions.getUser().then((user) => {
          if (!user) {
            history.replace('/login', { from: pathname });
          } else {
            this.setState({ authed: true });
          }
        });
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
    },
  );
}
