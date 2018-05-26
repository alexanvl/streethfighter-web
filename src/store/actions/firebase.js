const actions = {
  GET_USER: 'GET_USER',
  LOGIN_EMAIL: 'LOGIN_EMAIL',
  SIGNUP_EMAIL: 'SIGNUP_EMAIL',
  SIGN_OUT: 'SIGN_OUT',
  LISTEN_MODEL_ON: 'LISTEN_MODEL_ON',
  LISTEN_MODEL_OFF: 'LISTEN_MODEL_OFF'
};

export function getUser() {
  return { type: actions.GET_USER };
}

export function emailLogin(email, password) {
  return { type: actions.LOGIN_EMAIL, email, password };
}

export function emailSignUp(email, password) {
  return { type: actions.SIGNUP_EMAIL, email, password };
}

export function logOut() {
  return { type: actions.SIGN_OUT };
}

export function listenModelOn(modelId) {
  return { type: actions.LISTEN_MODEL_ON, modelId };
}

export function listenModelOff(modelId, listener) {
  return { type: actions.LISTEN_MODEL_OFF, modelId, listener };
}


export default actions;
