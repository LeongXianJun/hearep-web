import React, { FC, useState, useEffect } from 'react'
import {
  TextField, InputAdornment, Typography, TableHead, CardHeader,
  Card, CardContent, Grid, Table, TableBody,
  TableRow, TableCell, Breadcrumbs
} from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'
import { Search as SearchIcon } from '@material-ui/icons'

import { AppContainer, ReloadButton } from '../common'
import { UserStore, AppointmentStore } from '../../stores'

interface PageProp {

}

const AppointmentHistory: FC<PageProp> = () => {
  const isReady = UserStore.ready()
  const patients = UserStore.getPatients()
  const appointments = AppointmentStore.getGroupedAppointments()
  const allApp = [ ...appointments.Completed, ...appointments.Cancelled ]

  const [ filter, setFilter ] = useState('')
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isFetching, setIsFetching ] = useState(false)

  const onLoad = () => {
    setIsFetching(true)
    return Promise.all([
      UserStore.fetchAllPatients(),
      AppointmentStore.fetchAllAppointments()
    ]).catch(err => console.log(err))
      .then(() => setIsFetching(false))
  }

  useEffect(() => {
    if (isReady && isLoading) {
      onLoad()
        .finally(() => setIsLoading(false))
    }
  }, [ isReady, isLoading ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/appointment', text: 'Appointment' },
    { path: '/appointment/history', text: 'History' }
  ]

  return (
    <AppContainer isLoading={ isLoading }>
      <Breadcrumbs maxItems={ 4 } aria-label="breadcrumb">
        {
          breadcrumbs.map(({ path, text }, index, arr) => (
            index === arr.length - 1
              ? <Typography key={ 'l-' + index } color="textPrimary">{ text }</Typography>
              : <NavLink key={ 'l-' + index } color="inherit" to={ path }>
                { text }
              </NavLink>
          ))
        }
        <ReloadButton size='small' isSubmitting={ isFetching } onClick={ () => { onLoad() } } />
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
          {
            allApp.length > 0
              ? <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{ 'Patient' }</TableCell>
                    <TableCell>{ 'Date' }</TableCell>
                    <TableCell>{ 'Time / Turn' }</TableCell>
                    <TableCell>{ 'Status' }</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    allApp.map(a => ({ ...a, patient: patients.find(p => p.id === a.patientId) }))
                      .filter(a => a.patient?.username.includes(filter))
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((appointment, index) =>
                        appointment?.type === 'byTime'
                          ? <TableRow hover key={ 'c-' + index }>
                            <TableCell>{ appointment.patient?.username }</TableCell>
                            <TableCell>{ appointment.time.toDateString() }</TableCell>
                            <TableCell>{ appointment.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) }</TableCell>
                            <TableCell>{ appointment.status }</TableCell>
                          </TableRow>
                          : appointment?.type === 'byNumber'
                            ? <TableRow hover key={ 'c-' + index }>
                              <TableCell>{ appointment.patient?.username }</TableCell>
                              <TableCell>{ appointment.date.toDateString() }</TableCell>
                              <TableCell>{ appointment.turn + 1 }</TableCell>
                              <TableCell>{ appointment.status }</TableCell>
                            </TableRow>
                            : undefined
                      )
                  }
                </TableBody>
              </Table>
              : <Typography>{ 'No Appointment Yet' }</Typography>
          }
        </CardContent>
      </Card>
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(AppointmentHistory)