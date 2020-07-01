import qs from 'qs'
import UserStore from './UserStore'
import { CommonUtil } from '../utils'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AppointmentStore extends StoreBase {
  groupedAppointments: {
    'Pending': Appointment[],
    'Accepted': Appointment[],
    'Rejected': Appointment[],
    'Waiting': Appointment[],
    'Completed': Appointment[],
    'Cancelled': Appointment[]
  }
  selectedAppointment: Appointment | undefined
  patientAppointment: Appointment | undefined

  constructor() {
    super()
    this.groupedAppointments = {
      'Pending': [],
      'Accepted': [],
      'Rejected': [],
      'Waiting': [],
      'Completed': [],
      'Cancelled': []
    }
  }

  private getToken = () => UserStore.getToken()

  // get all appointments
  fetchAllAppointments = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/appointment/medicalstaff', {
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
            this.groupedAppointments = {
              'Pending': [],
              'Accepted': [],
              'Rejected': [],
              'Waiting': [],
              'Completed': [],
              'Cancelled': []
            }
            this.trigger(AppointmentStore.GroupedAppointmentsKey)
            throw new Error(data.errors)
          } else {
            const createAppointment = (app: any) =>
              app.type === 'byTime'
                ? new ByTimeApp(app)
                : new ByNumberApp(app)
            this.groupedAppointments = {
              'Pending': data[ 'Pending' ].map(createAppointment),
              'Accepted': data[ 'Accepted' ].map(createAppointment),
              'Rejected': data[ 'Rejected' ].map(createAppointment),
              'Waiting': data[ 'Waiting' ].map(createAppointment),
              'Completed': data[ 'Completed' ].map(createAppointment),
              'Cancelled': data[ 'Cancelled' ].map(createAppointment)
            }
            this.trigger(AppointmentStore.GroupedAppointmentsKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Health Records: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  // get an appointment
  fetchPatientAppointment = (appId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/appointment/get', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, appId })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(data => {
          if (data.errors) {
            this.patientAppointment = undefined
            this.trigger(AppointmentStore.PatientAppointmentKey)
            throw new Error(data.errors)
          } else {
            const createAppointment = (app: any) =>
              app.type === 'byTime'
                ? new ByTimeApp(app)
                : new ByNumberApp(app)
            this.patientAppointment = createAppointment(data)
            this.trigger(AppointmentStore.PatientAppointmentKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Health Records: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  // update status
  updateStatus = (input: { id: string, patientId: string, status: 'Accepted' | 'Rejected' }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(CommonUtil.getURL() + '/appointment/update', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            appointment: {
              ...input
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
            const targetApp = this.groupedAppointments.Pending.find(a => a.id === input.id)
            if (targetApp) {
              this.upApp(targetApp, 'Pending', input.status)
            }
            Promise.resolve()
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  static GroupedAppointmentsKey = 'GroupedAppointmentsKey'
  @autoSubscribeWithKey('GroupedAppointmentsKey')
  getGroupedAppointments() {
    return this.groupedAppointments
  }

  static SelectedAppointmentKey = 'SelectedAppointmentKey'
  @autoSubscribeWithKey('SelectedAppointmentKey')
  getSelectedAppointment() {
    return this.selectedAppointment
  }

  static PatientAppointmentKey = 'PatientAppointmentKey'
  @autoSubscribeWithKey('PatientAppointmentKey')
  getPatientAppointment() {
    return this.patientAppointment
  }

  setSelectedAppointment(app: Appointment) {
    this.selectedAppointment = app
  }

  upApp(targetApp: Appointment, from: Appointment[ 'status' ], to: Appointment[ 'status' ]) {
    this.groupedAppointments = {
      ...this.groupedAppointments,
      [ from ]: [
        ...this.groupedAppointments.Pending.filter(p => p.id !== targetApp.id)
      ],
      [ to ]: [ ...this.groupedAppointments.Accepted, targetApp ]
    }
    this.trigger(AppointmentStore.GroupedAppointmentsKey)
  }
}

class ByTimeApp {
  id: string
  patientId: string
  medicalStaffId: string
  date: Date
  address: string
  type: 'byTime' = 'byTime'
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled'
  time: Date

  constructor(input: any) {
    const { id, patientId, medicalStaffId, date, address, status, time } = input
    this.id = id
    this.patientId = patientId
    this.medicalStaffId = medicalStaffId
    this.date = new Date(date)
    this.address = address
    this.status = status
    this.time = new Date(time)
  }
}

class ByNumberApp {
  id: string
  patientId: string
  medicalStaffId: string
  date: Date
  address: string
  type: 'byNumber' = 'byNumber'
  status: 'Waiting' | 'Completed' | 'Cancelled'
  turn: number

  constructor(input: any) {
    const { id, patientId, medicalStaffId, date, address, status, turn } = input
    this.id = id
    this.patientId = patientId
    this.medicalStaffId = medicalStaffId
    this.date = new Date(date)
    this.address = address
    this.status = status
    this.turn = turn
  }
}

export {
  ByTimeApp,
  ByNumberApp
}
export type Appointment = ByTimeApp | ByNumberApp
export default new AppointmentStore()