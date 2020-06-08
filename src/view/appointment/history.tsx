import React, { FC, useState } from 'react'
import { AppContainer } from '../common'
import {
  TextField, InputAdornment, Typography, TableHead, CardHeader,
  Card, CardContent, Grid, Table, TableBody,
  TableRow, TableCell, Breadcrumbs
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import AC, { Appointment } from '../../connections/AppointmentConnection'
import RC from '../../connections/RecordConnection'
import UC from '../../connections/UserConnection'
import { useHistory, NavLink } from 'react-router-dom'

interface PageProp {

}

const AppointmentHistory: FC<PageProp> = () => {
  const history = useHistory()
  const [ filter, setFilter ] = useState('')

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/appointment', text: 'Appointment' },
    { path: '/patient/history', text: 'History' }
  ]

  const redirect = (app: Appointment) => {
    const r = RC.recordDB.find(r => r.type !== 'medication record' && r.appID === app.id)
    switch (r?.type ?? '') {
      case 'health prescription':
        history.push('/prescription/index')
        break
      case 'lab test result':
        history.push('/labTest/index')
        break
      default:
        break
    }
  }

  return (
    <AppContainer>
      <Breadcrumbs maxItems={ 3 } aria-label="breadcrumb">
        {
          breadcrumbs.map(({ path, text }, index, arr) => (
            index === arr.length - 1
              ? <Typography key={ 'l-' + index } color="textPrimary">{ text }</Typography>
              : <NavLink key={ 'l-' + index } color="inherit" to={ path }>
                { text }
              </NavLink>
          ))
        }
      </Breadcrumbs>
      <Card style={ { marginTop: 5 } }>
        <CardHeader
          title={
            <Grid container spacing={ 2 }>
              <Grid item xs={ 12 }>
                <Typography variant='h4' gutterBottom>{ 'Appointment History' }</Typography>
              </Grid>
            </Grid>
          }
          subheader={
            <TextField
              label='Search'
              placeholder="Please enter the patient's name"
              InputProps={ {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              } }
              onChange={ event => setFilter(event.target.value) }
              variant='outlined'
              fullWidth
            />
          }
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{ 'Patient' }</TableCell>
                <TableCell>{ 'Date' }</TableCell>
                <TableCell>{ 'Time' }</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                AC.appointmentDB.filter(a => a.name.includes(filter) && a.medicalStaff === UC.currentUser?.detail?.fullname && a.type === 'byTime')
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((appointment, index) =>
                    appointment.type === 'byTime'
                      ? <TableRow hover key={ 'row-' + index } onClick={ () => redirect(appointment) }>
                        <TableCell>{ appointment.name }</TableCell>
                        <TableCell>{ appointment.date.toDateString() }</TableCell>
                        <TableCell>{ appointment.time }</TableCell>
                      </TableRow>
                      : undefined
                  )
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppContainer>
  )
}

export default AppointmentHistory