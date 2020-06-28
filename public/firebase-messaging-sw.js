importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: '803146768068'
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