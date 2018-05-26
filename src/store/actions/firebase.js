const actions = {
  GET_USER: 'GET_USER',
  LOGIN_EMAIL: 'LOGIN_EMAIL',
  SIGNUP_EMAIL: 'SIGNUP_EMAIL',
  SIGN_OUT: 'SIGN_OUT',
  LISTEN_ON: 'LISTEN_ON',
  LISTEN_OFF: 'LISTEN_OFF',
  SET: 'SET',
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

export function listenOn(key, cb) {
  return { type: actions.LISTEN_ON, key, cb };
}

export function listenOff(key, cb) {
  return { type: actions.LISTEN_OFF, key, cb };
}

export function set(key, data) {
  return { type: actions.SET, key, data };
}

export default actions;
