import bindActions, { actionTypes } from '../../actions';
import * as Api from './api';


export default ({ dispatch, getState }) => {
  const actions = bindActions(dispatch);

  return next => (action) => {
    switch (action.type) {
      case actionTypes.firebase.GET_USER: {
        return Api.getUser();
      }
      case actionTypes.firebase.SIGNUP_EMAIL: {
        const { email, password } = action;

        return Api.signUpEmail(email, password);
      }
      case actionTypes.firebase.LOGIN_EMAIL: {
        const { email, password } = action;

        return Api.signInEmail(email, password);
      }
      case actionTypes.firebase.SIGN_OUT: {
        return Api.signOut();
      }
      case actionTypes.firebase.LISTEN_ON: {
        return Api.listenOn(
          action.key,
          action.cb
        );
      }
      case actionTypes.firebase.LISTEN_OFF: {
        return Api.listenOff(
          action.key,
          action.cb
        );
      }
      case actionTypes.firebase.SET: {
        return Api.set(action.key, action.data);
      }
      case actionTypes.firebase.UPDATE: {
        return Api.update(action.key, action.data);
      }
      default:
        return next(action);
    }
  };
}
