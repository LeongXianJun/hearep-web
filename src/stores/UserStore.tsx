import qs from 'qs'
import firebase from 'firebase'
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
      if (this.isRegistering === false) {
        this.fetchUser().then(() => {
          this.isReady = true
          this.trigger(UserStore.IsReadyKey)
        })
      }
    } else {
      this.firebaseUser = undefined
      // console.log('2', this.firebaseUser)
      this.isReady = true
      this.trigger(UserStore.IsReadyKey)
    }
  })

  private setFirebaseUser = (firebaseUser: firebase.User) => this.firebaseUser = firebaseUser

  getToken = async () => await this.firebaseUser?.getIdToken()

  // endpoints
  fetchUser = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/user/get', {
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
        }).catch(err => Promise.reject(new Error('Fetch User: ' + err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  fetchAllPatient = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/patient/all', {
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
        }).catch(err => Promise.reject(new Error('Fetch Patient: ' + err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  createUser = (info: { username: string, dob: string, gender: 'M' | 'F', medicalInstituition: MedicalInstituition }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/user/create', {
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
          .catch(err => new Error(err))
      } else {
        throw new Error('No Token Found')
      }
    })

  updateProfile = (latest: { username: string, dob: string, gender: 'M' | 'F', medicalInstituition: MedicalInstituition }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/user/update', {
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
          .catch(err => Promise.reject(new Error(err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  removeAccount = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/user/delete', {
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
          .catch(err => new Error(err))
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

  static IsReadyKey = 'IsReadyKey'
  @autoSubscribeWithKey('IsReadyKey')
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

  constructor(input: any) {
    super({ ...input })
    const { medicalInstituition } = input
    this.medicalInstituition = new MedicalInstituition({ ...medicalInstituition })
  }
}

class Patient extends UR {
  type: 'Patient' = 'Patient'
  phoneNumber: string
  occupation: string

  constructor(input: any) {
    super({ ...input })
    const { phoneNumber, occupation } = input
    this.phoneNumber = phoneNumber
    this.occupation = occupation
  }

}

class MedicalInstituition {
  role: string
  name: string
  address: string
  department: string

  constructor(input: { role: string, name: string, address: string, department: string }) {
    const { role, name, address, department } = input
    this.role = role
    this.name = name
    this.address = address
    this.department = department
  }
}

export {
  MedicalStaff,
  Patient
}
export default new UserStore()