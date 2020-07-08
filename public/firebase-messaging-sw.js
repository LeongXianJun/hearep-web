importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyACLHWtAA2ina9XwCuNOhTFpsmmeWt1lTg',
  appId: '1:803146768068:web:e7b755dc657a567ba57391',
  authDomain: 'hearep-b2cdb.firebaseapp.com',
  databaseURL: 'https://hearep-b2cdb.firebaseio.com',
  projectId: 'hearep-b2cdb',
  storageBucket: 'hearep-b2cdb.appspot.com',
  messagingSenderId: '803146768068',
  measurementId: 'G-9Z9J4S8RC7'
})

firebase.messaging().setBackgroundMessageHandler(payload =>
{
  const { data } = payload
  const notificationTitle = data.title
  const notificationOptions = {
    body: data.description
  }

  if (Notification.permission !== 'denied')
    return self.registration.showNotification(notificationTitle, notificationOptions)
})