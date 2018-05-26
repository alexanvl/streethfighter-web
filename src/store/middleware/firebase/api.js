import * as firebase from 'firebase';

let authCallback = null;

firebase.initializeApp({
  apiKey: "AIzaSyBfgGflSXVa6zoAc8z25xRhTXD2UhKbziE",
  authDomain: "wt-trading.firebaseapp.com",
  databaseURL: "https://wt-trading.firebaseio.com",
  projectId: "wt-trading",
  storageBucket: "wt-trading.appspot.com",
  messagingSenderId: "152013506681"
});

export function getUser() {
  if (!authCallback) {
    return new Promise((resolve, reject) => {
      authCallback = firebase.auth().onAuthStateChanged((user, error) => {
        if (user) {
          resolve(user);
        } else if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }

  return Promise.resolve(firebase.auth().currentUser);
}

export function signUpEmail(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function signInEmail(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function signOut() {
  return firebase.auth().signOut();
}

export function listenOn(ref, handler) {
  const handleSnapshot = (ss) => {
    if (ss.val()) {
      handler(ss.val());
    }
  };

  return firebase.database().ref(ref).remove()
    .then(() => firebase.database().ref(ref).on('value', handleSnapshot))
    .then(() => handleSnapshot);
}

export function listenOff(ref, listener) {
  return firebase.database().ref(ref).off('value', listener);
}