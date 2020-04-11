import React, { useState } from 'react'
import { AppContainer, AppExpansion, AppTable } from '../common'
import { TextField, InputAdornment, Typography, TableHead, CardHeader,
  Card, CardContent, Grid, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button, ButtonBase, 
  useMediaQuery, useTheme, Checkbox, FormControl, Table, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ScheduleIcon from '@material-ui/icons/Schedule'
import AC, { Appointment } from '../../connections/AppointmentConnection'
import UC, { User } from '../../connections/UserConnection'

import maleAvatar from '../../resources/images/maleAvatar.png'
import femaleAvatar from '../../resources/images/femaleAvatar.png'
import { useHistory, NavLink } from 'react-router-dom'

export default function AppointmentPage() {
  const theme = useTheme()
  const history = useHistory()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [ filter, setFilter ] = useState('')
  const [ timeslotOpen, setTimeslotOpen ] = useState(false)
  const [ rescheduledApp, setRescheduledApp ] = useState<Appointment>()

  return(
    <AppContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant='h2' gutterBottom>{'Appointment'}</Typography>
        </Grid>
        <Grid item container xs={12} md alignContent='center' justify='center'>
          <Button variant="contained" color='primary' onClick={() => setTimeslotOpen(true)}>{'Set Appointment Timeslot'}</Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppExpansion title='Upcoming Appointments'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{'Patient'}</TableCell>
                  <TableCell>{'Date'}</TableCell>
                  <TableCell>{'Time'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  AC.nearing.filter(a => a.medicalStaff === UC.currentUser?.detail?.fullname && a.type === 'byTime')
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((appointment, index) => 
                      appointment.type === 'byTime'
                      ? <TableRow hover key={'nearingR-' + index}>
                          <TableCell>{ appointment.name }</TableCell>
                          <TableCell>{ appointment.date.toDateString() }</TableCell>
                          <TableCell>{ appointment.time }</TableCell>
                        </TableRow>
                      : undefined
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              disableTypography
              title={
                <Grid container spacing={2}>
                  <Grid item xs={12} md={11}>
                    <Typography variant='h4' gutterBottom>{'All Appointment'}</Typography>
                  </Grid>
                  <Grid item container xs={12} md alignContent='center' justify='center'>
                    <NavLink to='/appointment/history'>{'History'}</NavLink>
                  </Grid>
                </Grid>
              }
              subheader={
                <TextField
                  // className={classes.margin}
                  label='Search'
                  placeholder="Please enter the patient's name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={event => setFilter(event.target.value)}
                  variant='outlined'
                  fullWidth
                />
              }
            />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{'Patient'}</TableCell>
                    <TableCell>{'Date'}</TableCell>
                    <TableCell>{'Time'}</TableCell>
                    <TableCell>{'Reschedule'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    AC.appointmentDB.filter(a => a.name.includes(filter) && a.medicalStaff === UC.currentUser?.detail?.fullname && a.type === 'byTime')
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((appointment, index) => 
                        appointment.type === 'byTime'
                        ? <TableRow hover key={'row-' + index}>
                            <TableCell>{ appointment.name }</TableCell>
                            <TableCell>{ appointment.date.toDateString() }</TableCell>
                            <TableCell>{ appointment.time }</TableCell>
                            <TableCell>
                              <IconButton onClick={() => setRescheduledApp(appointment)}>
                                <ScheduleIcon/>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        : undefined
                      )
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      { SetTimeslotDialog() }
      { RescheduleDialog() }
    </AppContainer>
  )

  function SetTimeslotDialog() {
    return (
      <Dialog open={timeslotOpen} onClose={() => setTimeslotOpen(false)} fullScreen={fullScreen}>
        <DialogTitle>{'Set Appointment Timeslot'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item>
              <Table>
                <TableBody>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeslotOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  function RescheduleDialog() {
    const reschedule = () => {
      setRescheduledApp(undefined)
    }

    return (
      <Dialog open={rescheduledApp !== undefined} onClose={() => setRescheduledApp(undefined)} fullScreen={fullScreen}>
        <DialogTitle>{'Reschedule Appointment'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Please  pick another time to reschedule."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduledApp(undefined)}>
            Cancel
          </Button>
          <Button onClick={reschedule} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}