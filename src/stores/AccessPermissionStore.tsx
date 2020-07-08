import qs from 'qs'
import { UserStore } from '.'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AccessPermissionStore extends StoreBase {
  isWaiting: boolean
  respond: 'pending' | 'accepted' | 'rejected'
  constructor() {
    super()
    this.isWaiting = false
    this.respond = 'pending'
  }

  private getToken = () => UserStore.getToken()

  requestAccess = (patientId: string, isEmergency: boolean, userIds: string[]) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        return await fetch('http://localhost:8001/access/request', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, patientId, isEmergency, userIds })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(data => {
          if (data.errors) {
            throw new Error(data.errors)
          } else {
            if (data.response.includes('Send Successfully')) {
              this.setIsWaiting(true, 'pending')
              return data.response
            } else {
              throw new Error('Weird Error')
            }
          }
        }).catch(err => Promise.reject(new Error('Access Request: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  static isWaitingKey = 'isWaitingKey'
  @autoSubscribeWithKey('isWaitingKey')
  getIsWaiting() {
    return this.isWaiting
  }

  static respondKey = 'respondKey'
  @autoSubscribeWithKey('respondKey')
  getRespond() {
    return this.respond
  }

  setRespond() {
    this.respond = 'pending'
    this.trigger(AccessPermissionStore.respondKey)
  }

  setIsWaiting(isWaiting: boolean, respond: 'pending' | 'accepted' | 'rejected') {
    this.isWaiting = isWaiting
    this.respond = respond
    this.trigger([ AccessPermissionStore.isWaitingKey, AccessPermissionStore.respondKey ])
  }
}

export default new AccessPermissionStore()