import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let authCallback = null;

export default firebase.initializeApp({
  apiKey: "AIzaSyCiDdsgg0bGEG4dUqJLgaF2R7VCJJH0NaI",
  authDomain: "ethba-hackathon.firebaseapp.com",
  databaseURL: "https://ethba-hackathon.firebaseio.com",
  projectId: "ethba-hackathon",
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

export function listenOn(ref, listener) {
  return firebase.database().ref(ref).on('value', ss => listener(ss.val()))
}

export function listenOff(ref) {
  return firebase.database().ref(ref).off('value');
}

export function set(ref, data) {
  return firebase.database().ref(ref).set(data);
}

export function update(ref, data) {
  return firebase.database().ref(ref).update(data);
}

export function remove(ref) {
  return firebase.database().ref(ref).remove();
}

// TODO rename
export function addToSet(ref, data) {
  const key = firebase.database().ref(ref).push().key;
  return set(`${ref}/${key}`, data);
}