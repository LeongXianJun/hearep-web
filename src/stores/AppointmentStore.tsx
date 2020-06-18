import qs from 'qs'
import { UserStore } from '.'
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
  getAllAppointments = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/appointment/medicalstaff', {
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
            this.trigger(AppointmentStore.getGroupedAppointmentsKey)
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
            this.trigger(AppointmentStore.getGroupedAppointmentsKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Health Records: ' + err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  // update status
  updateStatus = (input: { id: string, status: 'Accepted' | 'Rejected' }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/appointment/update', {
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
            Promise.resolve()
          }
        })
          .catch(err => Promise.reject(new Error(err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  static getGroupedAppointmentsKey = 'getGroupedAppointmentsKey'
  @autoSubscribeWithKey('getGroupedAppointmentsKey')
  getGroupedAppointments() {
    return this.groupedAppointments
  }

  static getSelectedAppointmentKey = 'getSelectedAppointmentKey'
  @autoSubscribeWithKey('getSelectedAppointmentKey')
  getSelectedAppointment() {
    return this.selectedAppointment
  }
}

class Appointment {
  id: string
  patientId: string
  medicalStaffId: string
  date: Date
  address: string

  constructor(input: any) {
    const { id, patientId, medicalStaffId, date, address } = input
    this.id = id
    this.patientId = patientId
    this.medicalStaffId = medicalStaffId
    this.date = new Date(date)
    this.address = address
  }
}

class ByTimeApp extends Appointment {
  type: 'byTime' = 'byTime'
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Rescheduled' | 'Cancelled'
  time: Date

  constructor(input: any) {
    super({ ...input })
    const { status, time } = input
    this.status = status
    this.time = new Date(time)
  }
}

class ByNumberApp extends Appointment {
  type: 'byNumber' = 'byNumber'
  status: 'Waiting' | 'Completed' | 'Cancelled'
  turn: number

  constructor(input: any) {
    super({ ...input })
    const { status, turn } = input
    this.status = status
    this.turn = turn
  }
}

export default new AppointmentStore()