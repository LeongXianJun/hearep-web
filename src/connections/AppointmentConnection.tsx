class AppointmentConnection {
  public static instance =  new AppointmentConnection()
  
  public nearing: Appointment[] = [
    { id: 1, name: 'Jax Pierce', date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Jone Leong', type: 'byTime', time: '1:30 pm' },
    { id: 2, name: 'Teejay Velazquez', date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Jone Leong', type: 'byTime', time: '2:30 pm' },
    { id: 3, name: 'Terri Woodard', date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Jone Leong', type: 'byTime', time: '7:00 pm' },
  ]
  public appointmentDB: Appointment[] = [
    ...this.nearing,
    { id: 4, name: 'Jax Pierce', date: new Date('2020-4-27'), medicalStaff: 'Jone Leong', type: 'byTime', time: '1:30 pm' },
    { id: 5, name: 'Teejay Velazquez', date: new Date('2020-4-27'), medicalStaff: 'Jone Leong', type: 'byTime', time: '2:30 pm' },
    { id: 6, name: 'Terri Woodard', date: new Date('2020-4-27'), medicalStaff: 'Jone Leong', type: 'byTime', time: '7:00 pm' },
    { id: 7, name: 'Leong Xian Jun', date: new Date('2020-4-1'), medicalStaff: 'Jone Leong', type: 'byTime', time: '2:00 pm' },
    { id: 8, name: 'Leong Xian Jun', date: new Date('2020-4-16'), medicalStaff: 'Jone Leong', type: 'byTime', time: '10:00 am' },
    { id: 9, name: 'Leong Xian Jun', date: new Date('2020-4-20'), medicalStaff: 'Alan', type: 'byTime', time: '10:00 am' },
    { id: 10, name: 'Leong Xian Jun', date: new Date('2020-4-24'), medicalStaff: 'Jone Leong', type: 'byTime', time: '10:00 am' },
    { id: 11, name: 'Leong Xian Jun', date: new Date('2020-4-28'), medicalStaff: 'Jone Leong', type: 'byNumber', turn: 5 }
  ]
  public selectedApp: Appointment = this.appointmentDB[0]


  public workingTimes: WorkingTime[] = [
    { 
      id: 1, userId: 1, type: 'byTime', 
      timeslots: [
        { day: 'Sunday', slots: [1, 3, 5, 7, 9] },
        { day: 'Monday', slots: [2, 3, 4, 5] },
        { day: 'Tuesday', slots: [6, 7, 8] },
        { day: 'Wednesday', slots: [1, 2, 3, 6, 7, 8] },
        { day: 'Thursday', slots: [1, 3, 5, 7, 8, 10] },
        { day: 'Friday', slots: [1, 3, 5, 7, 8, 10] },
        { day: 'Saturday', slots: [1, 3, 5, 7, 9] }
      ]
    }
  ]
}

export type Appointment = {
  id: number
  name: string
  date: Date
  medicalStaff: string
  address?: string // need because the doctor may transfer to another. Some may work in multiple location
} & (
  {
    type: 'byTime'
    time: string
  } | {
    type: 'byNumber'
    turn: number
  }
)

export const FixedTime = [
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
]

export type WorkingTime = {
  id: number
  userId: number
} & (
  {
    type: 'byTime'
    timeslots: {
      day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
      slots: number[]
    }[]
  } | {
    type: 'byNumber'
    timeslots: {
      day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
      startTime: string
      endTime: string
    }[]
  }
)

export default AppointmentConnection.instance