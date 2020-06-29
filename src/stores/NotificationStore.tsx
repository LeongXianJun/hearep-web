import qs from 'qs'
import firebase from 'firebase'
import UserStore from './UserStore'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class NotificationStore extends StoreBase {
  notification: { title: string, description: string }[]
  constructor() {
    super()
    this.notification = []
  }

  private getToken = () => UserStore.getToken()
  messaging = firebase.messaging()

  unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
    this.setTokenSentToServer(false)
    this.messaging.getToken().then(refreshedToken => {
      this.notification = []
      this.sendTokenToServer(refreshedToken)
      this.trigger(NotificationStore.NotificationsKey)
    }).catch(err =>
      console.log('Unable to retrieve refreshed token ', err)
    )
  })

  unsubscribeOnMessage = navigator.serviceWorker.addEventListener('message', payload => {
    const { data: { 'firebase-messaging-msg-data': { data } } } = payload
    this.notification = [
      { title: data.title, description: data.description }
    ]
    this.trigger(NotificationStore.NotificationsKey)
  })

  sendTokenToServer = (currentToken: string) => {
    if (window.localStorage.getItem('sentToServer') !== '1') {
      this.getToken().then(async userToken => {
        if (userToken) {
          await fetch('http://localhost:8001/user/device', {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({ userToken, deviceToken: currentToken })
          }).then(response => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error(response.status + ': (' + response.statusText + ')')
            }
          }).then(result => {
            if (result.errors) {
              throw new Error(result.errors)
            } else {
              this.setTokenSentToServer(true)
            }
          })
            .catch(err => Promise.reject(new Error(err.message)))
        } else {
          throw new Error('No Token Found')
        }
      })
    }
  }

  setTokenSentToServer = (sent: boolean) =>
    window.localStorage.setItem('sentToServer', sent ? '1' : '0')

  static NotificationsKey = 'NotificationsKey'
  @autoSubscribeWithKey('NotificationsKey')
  getNotifications() {
    return this.notification
  }
}

export default new NotificationStore()