import qs from 'qs'
import { UserStore } from '.'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class HealthConditionStore extends StoreBase {
  isReady: boolean
  currentPatientId: string
  healthCondition: {
    'Blood Sugar Level': { day: Date, count: number, length: number }[],
    'Blood Pressure Level': { day: Date, count: number, length: number }[],
    'BMI': { day: Date, count: number, length: number }[],
  }
  constructor() {
    super()
    this.isReady = false
    this.currentPatientId = ''
    this.healthCondition = {
      'Blood Sugar Level': [],
      'Blood Pressure Level': [],
      'BMI': [],
    }
  }

  private getToken = () => UserStore.getToken()

  fetchHealthCondition = (patientId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        if (userToken) {
          await fetch('http://localhost:8001/healthCondition/get', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({ userToken, date: new Date(), patientId })
          }).then(response => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error(response.status + ': (' + response.statusText + ')')
            }
          }).then(data => {
            if (data.errors) {
              this.isReady = false
              this.trigger([ HealthConditionStore.HCReadyKey ])
              throw new Error(data.errors)
            } else {
              this.isReady = true
              this.currentPatientId = patientId
              this.healthCondition = {
                'Blood Sugar Level': data[ 'Blood Sugar Level' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length })),
                'Blood Pressure Level': data[ 'Blood Pressure Level' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length })),
                'BMI': data[ 'BMI' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length }))
              }
              this.trigger([ HealthConditionStore.HealthConditionKey, HealthConditionStore.HCReadyKey ])
            }
          }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
        } else {
          throw new Error('No Token Found')
        }
      }
    })

  static HealthConditionKey = 'HealthConditionKey'
  @autoSubscribeWithKey('HealthConditionKey')
  getHealthCondition() {
    return this.healthCondition
  }

  static HCReadyKey = 'HCReadyKey'
  @autoSubscribeWithKey('HCReadyKey')
  ready() {
    return this.isReady
  }
}

export default new HealthConditionStore()