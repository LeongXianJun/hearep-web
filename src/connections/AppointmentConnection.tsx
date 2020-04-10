class AppointmentConnection {
  public static instance =  new AppointmentConnection()

  public appointmentDB: Appointment[] = [
    { id: 1, name: 'Jax Pierce', date: new Date('2020-4-27'), consultant: 'Jone Leong', type: 'byTime', time: '1:30pm' },
    { id: 2, name: 'Teejay Velazquez', date: new Date('2020-4-27'), consultant: 'Jone Leong', type: 'byTime', time: '2:30pm' },
    { id: 3, name: 'Terri Woodard', date: new Date('2020-4-27'), consultant: 'Jone Leong', type: 'byTime', time: '7:00pm' },
    { id: 5, name: 'Leong Xian Jun', date: new Date('2020-4-1'), consultant: 'Jone Leong', type: 'byTime', time: '2:00pm' },
    { id: 6, name: 'Leong Xian Jun', date: new Date('2020-4-16'), consultant: 'Jone Leong', type: 'byTime', time: '10:00am' },
    { id: 7, name: 'Leong Xian Jun', date: new Date('2020-4-20'), consultant: 'Alan', type: 'byTime', time: '10:00am' },
    { id: 8, name: 'Leong Xian Jun', date: new Date('2020-4-24'), consultant: 'Jone Leong', type: 'byTime', time: '10:00am' },
    { id: 9, name: 'Leong Xian Jun', date: new Date('2020-4-28'), consultant: 'Jone Leong', type: 'byNumber', turn: 5 }
  ]

}

export type Appointment = {
  id: number
  name: string
  date: Date
  consultant: string
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

export default AppointmentConnection.instance