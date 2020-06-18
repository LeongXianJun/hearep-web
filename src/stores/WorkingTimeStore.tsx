import qs from 'qs'
import { UserStore } from '.'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class TimeIntervalStore extends StoreBase {
  timeInterval: Date[]

  constructor() {
    super()
    this.timeInterval = []
  }

  private getToken = () => UserStore.getToken()

  fetchTimeInterval = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/workingtime/timeinterval', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken
          })
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
            this.timeInterval = (result as Array<any>).map(r => new Date(r))
            this.trigger(TimeIntervalStore.getTimeIntevalKey)
          }
        })
          .catch(err => new Error(err))
      } else {
        throw new Error('No Token Found')
      }
    })

  // variables
  static getTimeIntevalKey = 'getTimeIntevalKey'
  @autoSubscribeWithKey('getTimeIntevalKey')
  getTimeInterval() {
    return this.timeInterval
  }
}

export default new TimeIntervalStore()