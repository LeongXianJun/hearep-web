import firebase from 'firebase'
// import { History } from 'history'

const register = (email: string, password: string) =>
  firebase.auth().createUserWithEmailAndPassword(email, password)

const signIn = (email: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(email, password)

const getToken = () =>
  firebase.auth().currentUser?.getIdToken()

const signOut = () =>
  firebase.auth().signOut()

// // this will call when the auth state changed
// const onAuthStateChanged = (history: History) => 
//   firebase.auth().onAuthStateChanged(user => {
//     if(user) {
//       // directly show the homepage
//       history.replace('/dashboard')

//       // some other actions
//     } else {
//       // redirect to login page
//       history.replace('/login')
//     }
//   })

export default {
  register,
  signIn,
  getToken,
  signOut,
  // onAuthStateChanged
}