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
      case actionTypes.firebase.LISTEN_MODEL_ON: {
        return Api.listenOn(
          `model_id/${action.modelId}/module_id`,
          actions.watchtowerActions.handleModel
        );
      }
      case actionTypes.firebase.LISTEN_MODEL_OFF: {
        return Api.listenOff(
          `model_id/${action.modelId}/module_id`,
          action.listener
        );
      }
      default:
        return next(action);
    }
  };
}
