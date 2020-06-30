import qs from 'qs'
import firebase from 'firebase'
import { CommonUtil } from '../utils'
import NotificationStore from './NotificationStore'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class UserStore extends StoreBase {
  private user: MedicalStaff | undefined
  private firebaseUser: firebase.User | undefined
  private patients: Patient[]
  private isRegistering: boolean
  private isReady: boolean

  constructor() {
    super()
    this.patients = []
    this.isRegistering = false
    this.isReady = false
  }

  unsubscribe = firebase.auth().onIdTokenChanged(firebaseUser => {
    if (firebaseUser) {
      // console.log('1', firebaseUser.uid)
      this.setFirebaseUser(firebaseUser)

      // Get Instance ID token. Initially this makes a network call, once retrieved subsequent calls to getToken will return from cache.
      firebase.messaging().getToken().then((currentToken) => {
        if (currentToken) {
          NotificationStore.sendTokenToServer(currentToken)
          if (Notification.permission === 'default')
            Notification.requestPermission()
        } else {
          throw new Error('No Instance ID token available. Request permission to generate one.')
        }
      }).catch(err =>
        window.localStorage.setItem('sentToServer', '0')
      )

      if (this.isRegistering === false) {
        this.fetchUser().then(() => {
          this.isReady = true
          this.trigger(UserStore.UReadyKey)
        })
      }
    } else {
      this.firebaseUser = undefined
      // console.log('2', this.firebaseUser)
      this.isReady = true
      this.trigger(UserStore.UReadyKey)
    }
  })

  private setFirebaseUser = (firebaseUser: firebase.User) => this.firebaseUser = firebaseUser

  getToken = async () => await this.firebaseUser?.getIdToken()

  // endpoints
  fetchUser = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/user/get', {
          method: 'POST',
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
        }).then(data => {
          this.user = new MedicalStaff(data)
          this.trigger(UserStore.UserKey)
        }).catch(err => Promise.reject(new Error('Fetch User: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  fetchAllPatients = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/patient/all', {
          method: 'POST',
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
        }).then(data => {
          if (data.errors) {
            throw new Error(data.errors)
          } else {
            this.patients = data.map((p: any) => new Patient(p))
            this.trigger(UserStore.PatientKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Patient: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  createUser = (info: { username: string, dob: string, gender: 'M' | 'F', medicalInstituition: MedicalInstituition }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/user/create', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            user: {
              type: 'Medical Staff',
              email: this.firebaseUser?.email,
              ...info
            }
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
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  updateProfile = (latest: { username: string, dob: string, gender: 'M' | 'F', medicalInstituition: MedicalInstituition }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/user/update', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            user: {
              type: 'Medical Staff',
              ...latest
            }
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
          } else if ((result.response as string).includes('success')) {
            if (this.user) {
              this.user = new MedicalStaff({ ...this.user, ...latest })
              this.trigger(UserStore.UserKey)
            }
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  removeAccount = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/user/delete', {
          method: 'PUT',
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
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  updateWorkingTime = (workingTime: WorkingTime) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/workingtime/update', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, workingTime })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          } else if ((result.response as string).includes('success')) {
            if (this.user) {
              this.user = new MedicalStaff({ ...this.user, workingTime })
              this.trigger(UserStore.UserKey)
            }
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  // variables
  static UserKey = 'UserKey'
  @autoSubscribeWithKey('UserKey')
  getUser() {
    return this.user
  }

  static PatientKey = 'PatientKey'
  @autoSubscribeWithKey('PatientKey')
  getPatients() {
    return this.patients
  }

  static UReadyKey = 'UReadyKey'
  @autoSubscribeWithKey('UReadyKey')
  ready() {
    return this.isReady
  }

  setRegister(register: boolean) {
    this.isRegistering = register
  }
}

class UR {
  id: string
  username: string
  dob: Date
  gender: 'M' | 'F'
  email: string

  constructor(input: { id: string, username: string, dob: string, gender: 'M' | 'F', email: string }) {
    const { id, username, dob, gender, email } = input

    this.id = id
    this.username = username
    this.dob = new Date(dob)
    this.gender = gender
    this.email = email
  }
}

class MedicalStaff extends UR {
  type: 'Medical Staff' = 'Medical Staff'
  medicalInstituition: MedicalInstituition
  workingTime?: WorkingTime

  constructor(input: any) {
    super({ ...input })
    const { medicalInstituition, workingTime } = input
    this.medicalInstituition = new MedicalInstituition({ ...medicalInstituition })
    this.workingTime = workingTime
      ? workingTime.type === 'byTime'
        ? new ByTimeWT(workingTime)
        : workingTime.type === 'byNumber'
          ? new ByNumberWT(workingTime)
          : undefined
      : undefined
  }
}

class Patient extends UR {
  type: 'Patient' = 'Patient'
  phoneNumber: string
  occupation: string
  authorizedUsers: string[]

  constructor(input: any) {
    super({ ...input })
    const { phoneNumber, occupation, authorizedUsers } = input
    this.phoneNumber = phoneNumber
    this.occupation = occupation
    this.authorizedUsers = authorizedUsers as Array<any>
  }
}

class MedicalInstituition {
  role: string
  name: string
  address: string
  department: string

  constructor(input: any) {
    const { role, name, address, department } = input
    this.role = role
    this.name = name
    this.address = address
    this.department = department
  }
}

type WorkingTime = ByTimeWT | ByNumberWT

class ByTimeWT {
  type: 'byTime' = 'byTime'
  timeslots: {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6
    slots: number[]
  }[]

  constructor(input: any) {
    const { timeslots } = input
    this.timeslots = (timeslots as Array<any>).map(ts => ({
      day: ts.day,
      slots: ts.slots
    }))
  }
}

class ByNumberWT {
  type: 'byNumber' = 'byNumber'
  timeslots: {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6
    startTime: Date
    endTime: Date
  }[]

  constructor(input: any) {
    const { timeslots } = input
    this.timeslots = (timeslots as Array<any>).map(ts => ({
      day: ts.day,
      startTime: new Date(ts.startTime),
      endTime: new Date(ts.endTime),
    }))
  }
}

export {
  MedicalStaff,
  Patient,
  ByTimeWT,
  ByNumberWT
}
export default new UserStore()