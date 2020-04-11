import React, { useState } from 'react'
import { AppContainer, AppExpansion, AppTabPanel } from '../common'
import { TextField, InputAdornment, Typography, TableHead, CardHeader,
  Card, CardContent, Grid, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button, useMediaQuery, 
  useTheme, Table, TableBody, TableRow, TableCell, 
  IconButton, Paper, Tabs, Tab, Checkbox } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ScheduleIcon from '@material-ui/icons/Schedule'
import AC, { Appointment, FixedTime } from '../../connections/AppointmentConnection'
import UC from '../../connections/UserConnection'

import { NavLink } from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views'

export default function AppointmentPage() {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [ filter, setFilter ] = useState('')
  const [ timeslotOpen, setTimeslotOpen ] = useState(false)
  const [ rescheduledApp, setRescheduledApp ] = useState<Appointment>()

  return(
    <AppContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant='h2'>{'Appointment'}</Typography>
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
                  <Grid item xs={11}>
                    <Typography variant='h4'>{'All Appointment'}</Typography>
                  </Grid>
                  <Grid item container xs alignContent='center' justify='center'>
                    <NavLink to='/appointment/history'>{'History'}</NavLink>
                  </Grid>
                </Grid>
              }
              subheader={
                <TextField
                  style={{marginTop: 10}}
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
    const [value, setValue] = React.useState(0)
  
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    }
  
    const handleChangeIndex = (index: number) => {
      setValue(index);
    }

    const submit = () => {
      setTimeslotOpen(false)
    }

    function tabProps(index: any) {
      return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
      };
    }

    return (
      <Dialog open={timeslotOpen} maxWidth='md' onClose={() => setTimeslotOpen(false)} fullScreen={fullScreen}>
        <DialogTitle>{'Set Appointment Timeslot'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item>
              <Paper>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant='fullWidth'
                >
                  <Tab label='By Time' {...tabProps(0)}/>
                  <Tab label='By Number' {...tabProps(1)}/>
                </Tabs>
                <SwipeableViews
                  containerStyle={{alignContent: 'center'}}
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  disabled
                  onChangeIndex={handleChangeIndex}
                >
                  {
                    [ByTime(), ByNumber()].map((ele, index) => (
                      <AppTabPanel key={'tp-' + index} value={value} index={index} dir={theme.direction}>
                        { ele }
                      </AppTabPanel>
                    ))
                  }
                </SwipeableViews>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeslotOpen(false)} variant="contained" color='default'>
            Close
          </Button>
          <Button onClick={submit}variant="contained" color='primary'>
            Set
          </Button>
        </DialogActions>
      </Dialog>
    )

    function ByTime() {
      const headers = ['Day', ...FixedTime]
      const rows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const data: boolean[][] = rows.map(() => [...Array(FixedTime.length)].map(() => false))

      const handleChange = (r: number, c: number) => (checked: boolean) => {
        data[r][c] = checked
      }

      return (
        <Table>
          <TableHead>
            <TableRow>
              { headers.map((h, index) => <TableCell key={'th-' + index}>{h}</TableCell>) }
            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map((r, rindex) => 
              <TableRow hover key={'tr-' + rindex}>
                <TableCell>{r}</TableCell>
                { FixedTime.map((ft, i) => 
                    <TableCell key={ft + '-' + i}>
                      <Checkbox
                        onChange={event => handleChange(rindex, i)(event.target.checked)}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </TableCell>
                  )
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      )
    }
  
    function ByNumber() {
      const rows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const data: string[][] = rows.map(() => [...Array(2)].map(() => ''))
      const isWorking: boolean[] = [...Array(7)].map(() => true)

      const setWorking = (r: number) => (value: boolean) => {
        isWorking[r] = value
        console.log(r, isWorking[r])
      }

      const handleChange = (r: number, c: number) => (value: string) => {
        data[r][c] = value
      }

      return (
        <Table>
          <TableBody>
            { rows.map((r, rindex) => 
              <TableRow hover key={'tr-' + rindex}>
                <TableCell>
                  <Checkbox
                    onChange={event => setWorking(rindex)(event.target.checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </TableCell>
                <TableCell>{r}</TableCell>
                <TableCell>
                  <TextField
                    variant='outlined'
                    label="Start Time"
                    fullWidth
                    style={{minWidth: '100px'}}
                    onChange = {event => handleChange(rindex, 0)(event.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant='outlined'
                    label="End Time"
                    fullWidth
                    style={{minWidth: '100px'}}
                    onChange = {event => handleChange(rindex, 1)(event.target.value)}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )
    }
  }


  function RescheduleDialog() {
    const headers = ['Day', ...FixedTime]
    const rows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const [checked, setChecked] = useState('')

    const handleChange = (r: number, c: number) => (checked: boolean) => {
      setChecked(r + '-' + c)
      console.log(r + '-' + c, checked)
    }

    const reschedule = () => {
      setRescheduledApp(undefined)
    }

    return (
      <Dialog open={rescheduledApp !== undefined} onClose={() => setRescheduledApp(undefined)} maxWidth='md' fullScreen={fullScreen}>
        <DialogTitle>{'Reschedule Appointment'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Please pick another time to reschedule."}
          </DialogContentText>
          <Table>
            <TableHead>
              <TableRow>
                { headers.map((h, index) => <TableCell key={'th-' + index}>{h}</TableCell>) }
              </TableRow>
            </TableHead>
            <TableBody>
              { rows.map((r, rindex) => 
                <TableRow hover key={'tr-' + rindex}>
                  <TableCell>{r}</TableCell>
                  { FixedTime.map((ft, i) => 
                      <TableCell key={ft + '-' + i}>
                        <Checkbox
                          checked={rindex + '-' + i === checked}
                          onChange={event => handleChange(rindex, i)(event.target.checked)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                      </TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>
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