class AppointmentConnection {
  public static instance =  new AppointmentConnection()

  public appointmentDB: Appointment[] = [
    { name: 'Jax Pierce', date: new Date('27/04/2020 1:30pm') },
    { name: 'Teejay Velazquez', date: new Date('27/04/2020 2:30pm') },
    { name: 'Terri Woodard', date: new Date('27/04/2020 7:00pm') }
  ]

}

export interface Appointment {
  name: string
  date: Date
}

export default AppointmentConnection.instance