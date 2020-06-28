importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js')

console.log(process?.env ?? 'GG')

firebase.initializeApp({
  messagingSenderId: '803146768068'
})

firebase.messaging().setBackgroundMessageHandler(payload =>
{
  const { data } = payload
  // console.log('Message received. 2', data)
  const notificationTitle = data.title
  const notificationOptions = {
    body: data.description,
    icon: '/resources/logo/icon.svg'
  }

  if (Notification.permission !== 'denied')
    return self.registration.showNotification(notificationTitle, notificationOptions)
})