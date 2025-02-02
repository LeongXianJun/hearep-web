import qs from 'qs'
import UserStore from './UserStore'
import { CommonUtil } from '../utils'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AnalysisStore extends StoreBase {
  analysis: {
    NewApp: { day: Date, count: number }[],
    HandledApp: { day: Date, count: number }[],
    AverageWaitingTime: { day: Date, averageTime: number }[]
  }
  constructor() {
    super()
    this.analysis = {
      NewApp: [],
      HandledApp: [],
      AverageWaitingTime: []
    }
  }

  private getToken = () => UserStore.getToken()

  fetchPerformanceAnalysis = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/analysis/get', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, date: new Date() })
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
            this.analysis = {
              NewApp: data[ 'NewApp' ].map((d: any) => ({ day: new Date(d.day), count: d.count })),
              HandledApp: data[ 'HandledApp' ].map((d: any) => ({ day: new Date(d.day), count: d.count })),
              AverageWaitingTime: data[ 'AverageWaitingTime' ].map((d: any) => ({ day: new Date(d.day), averageTime: d.averageTime }))
            }
            this.trigger(AnalysisStore.AnalysisKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  static AnalysisKey = 'AnalysisKey'
  @autoSubscribeWithKey('AnalysisKey')
  getAnalysis() {
    return this.analysis
  }
}

export default new AnalysisStore()