import firebase from 'firebase'

const register = (email: string, password: string) =>
  firebase.auth().createUserWithEmailAndPassword(email, password)

const signIn = (email: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(email, password)

const getToken = () =>
  firebase.auth().currentUser?.getIdToken()

const signOut = () =>
  firebase.auth().signOut()

export default {
  register,
  signIn,
  getToken,
  signOut,
}