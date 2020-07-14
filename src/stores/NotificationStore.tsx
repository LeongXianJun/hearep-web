import qs from 'qs'
import firebase from 'firebase'
import UserStore from './UserStore'
import { CommonUtil } from '../utils'
import AccessPermissionStore from './AccessPermissionStore'
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
    this.messaging.getToken().then(refreshedToken => {
      this.notification = []
      this.sendTokenToServer(refreshedToken)
      this.trigger(NotificationStore.NotificationsKey)
    }).catch(err =>
      console.log('Unable to retrieve refreshed token ', err)
    )
  })

  unsubscribeOnMessage = navigator.serviceWorker.addEventListener('message', payload => {
    const { data: { 'firebaseMessaging': { payload: { data } } } } = payload
    if (data.status) {
      if (data.status === 'Permitted') {
        AccessPermissionStore.setIsWaiting(false, 'accepted')
      } else {
        AccessPermissionStore.setIsWaiting(false, 'rejected')
      }
    } else {
      this.notification = [
        { title: data.title, description: data.description }
      ]
      this.trigger(NotificationStore.NotificationsKey)
    }
  })

  sendTokenToServer = (currentToken: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/user/device', {
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
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  removeToken = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/user/device/remove', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  static NotificationsKey = 'NotificationsKey'
  @autoSubscribeWithKey('NotificationsKey')
  getNotifications() {
    return this.notification
  }
}

export default new NotificationStore()