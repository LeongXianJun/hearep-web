import React, { useState, FC, useEffect } from 'react'
import { AppContainer, AppExpansion, AppTabPanel } from '../common'
import {
  TextField, InputAdornment, Typography, TableHead, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  useMediaQuery, useTheme, Table, TableBody, TableRow,
  TableCell, Paper, Tabs, Tab, Checkbox
} from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns'
import SwipeableViews from 'react-swipeable-views'
import { withResubAutoSubscriptions } from 'resub'
import { Search as SearchIcon } from '@material-ui/icons'
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers'

import { UserStore, AppointmentStore, WorkingTimeStore } from '../../stores'

interface PageProp {

}

const AppointmentPage: FC<PageProp> = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const isReady = UserStore.ready()
  const patients = UserStore.getPatients()
  const isAppStoreReady = AppointmentStore.ready()
  const appointments = AppointmentStore.getGroupedAppointments()
  const isWTReady = WorkingTimeStore.ready()
  const TimeInterval = WorkingTimeStore.getTimeInterval()

  const [ filter, setFilter ] = useState('')
  const [ timeslotOpen, setTimeslotOpen ] = useState(false)

  useEffect(() => {
    if (isReady && patients.length === 0)
      UserStore.fetchAllPatient()
        .catch(err => console.log(err))
  }, [ isReady, patients ])

  useEffect(() => {
    if (isReady && isAppStoreReady === false)
      AppointmentStore.fetchAllAppointments()
        .catch(err => console.log(err))
  }, [ isReady, isAppStoreReady ])

  useEffect(() => {
    if (isReady && isWTReady === false && TimeInterval.length === 0)
      WorkingTimeStore.fetchTimeInterval()
        .catch(err => console.log(err))
  }, [ isReady, isWTReady, TimeInterval ])

  const updateStatus = (id: string, status: 'Accepted' | 'Rejected') => () =>
    AppointmentStore.updateStatus({ id, status })

  return (
    <AppContainer isLoading={ isReady === false }>
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } sm={ 8 }>
          <Typography variant='h2'>{ 'Appointments' }</Typography>
        </Grid>
        <Grid item container xs={ 12 } sm={ 1 } alignContent='center' justify='center'>
          <NavLink to='/appointment/history'>{ 'History' }</NavLink>
        </Grid>
        <Grid item container xs={ 12 } sm alignContent='center' justify='center'>
          <Button variant="contained" color='primary' onClick={ () => setTimeslotOpen(true) }>{ 'Set Appointment Timeslot' }</Button>
        </Grid>
      </Grid>
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 }>
          <TextField
            style={ { marginTop: 10 } }
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
        </Grid>
        {
          [
            { category: 'Pending', apps: appointments[ 'Pending' ] },
            { category: 'Waiting', apps: appointments[ 'Waiting' ] },
            { category: 'Accepted', apps: appointments[ 'Accepted' ] },
            { category: 'Rejected', apps: appointments[ 'Rejected' ] }
          ].filter(record => record.apps.length > 0)
            .map(({ category, apps }) =>
              <Grid key={ category + '-list' } item xs={ 12 }>
                <AppExpansion title={ category + ' Appointments' }>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{ 'Patient' }</TableCell>
                        <TableCell>{ 'Date' }</TableCell>
                        <TableCell>{ category === 'Waiting' ? 'Turn' : 'Time' }</TableCell>
                        {
                          [ 'Pending' ].includes(category)
                            ? <TableCell>{ 'Action' }</TableCell>
                            : undefined
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        apps.map(a => ({ ...a, patient: patients.find(p => p.id === a.patientId) }))
                          .filter(a => a.patient?.username.includes(filter))
                          .sort((a, b) => a.date.getTime() - b.date.getTime())
                          .map((appointment, index) =>
                            appointment?.type === 'byTime'
                              ? <TableRow hover key={ 'c-' + index }>
                                <TableCell>{ appointment.patient?.username }</TableCell>
                                <TableCell>{ appointment.time.toDateString() }</TableCell>
                                <TableCell>{ appointment.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) }</TableCell>
                                {
                                  category === 'Pending'
                                    ? <TableCell>
                                      <Button size="small" onClick={ updateStatus(appointment.id, 'Accepted') } variant='contained' color='primary'>{ 'Accept' }</Button>
                                      <Button size="small" onClick={ updateStatus(appointment.id, 'Rejected') } color='secondary' style={ { marginLeft: 10 } }>{ 'Reject' }</Button>
                                    </TableCell>
                                    : undefined
                                }
                              </TableRow>
                              : appointment?.type === 'byNumber'
                                ? <TableRow hover key={ 'c-' + index }>
                                  <TableCell>{ appointment.patient?.username }</TableCell>
                                  <TableCell>{ appointment.date.toDateString() }</TableCell>
                                  <TableCell>{ appointment.turn + 1 }</TableCell>
                                </TableRow>
                                : undefined
                          )
                      }
                    </TableBody>
                  </Table>
                </AppExpansion>
              </Grid>
            )
        }
      </Grid>
      { SetTimeslotDialog() }
    </AppContainer>
  )

  function SetTimeslotDialog() {
    const rows = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
    const [ value, setValue ] = React.useState(0)
    const [ byTimeData, setByTimeData ] = useState(rows.map(() => [ ...Array(TimeInterval.length) ].map(() => false)))
    const [ isWorking, setIsWorking ] = useState([ ...Array(7) ].map(() => false))
    const [ byNumberData, setByNumberData ] = useState(rows.map(() => [ ...Array(2) ].map(() => new Date())))

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    }

    const handleChangeIndex = (index: number) => {
      setValue(index);
    }

    const submit = () =>
      UserStore.updateWorkingTime({
        ...value === 0
          ? {
            type: 'byTime',
            timeslots: [
              ...byTimeData.map((d, i) => ({ day: i as 0 | 1 | 2 | 3 | 4 | 5 | 6, slots: d.reduce<number[]>((r, s, index) => s ? [ ...r, index ] : r, []) })).filter(d => d.slots.length > 0)
            ]
          }
          : {
            type: 'byNumber',
            timeslots: [
              ...byNumberData.map((d, i) => ({ day: i as 0 | 1 | 2 | 3 | 4 | 5 | 6, startTime: d[ 0 ], endTime: d[ 1 ] })).filter((d, i) => isWorking[ i ])
            ]
          }
      }).then(() => setTimeslotOpen(false))

    function tabProps(index: any) {
      return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
      };
    }

    return (
      <Dialog open={ timeslotOpen } maxWidth='md' onClose={ () => setTimeslotOpen(false) } fullScreen={ fullScreen }>
        <DialogTitle>{ 'Set Appointment Timeslot' }</DialogTitle>
        <DialogContent>
          <Grid container spacing={ 1 }>
            <Grid item>
              <Paper>
                <Tabs
                  value={ value }
                  onChange={ handleChange }
                  indicatorColor="primary"
                  textColor="primary"
                  variant='fullWidth'
                >
                  <Tab label='By Time' { ...tabProps(0) } />
                  <Tab label='By Number' { ...tabProps(1) } />
                </Tabs>
                <SwipeableViews
                  containerStyle={ { alignContent: 'center' } }
                  axis={ theme.direction === 'rtl' ? 'x-reverse' : 'x' }
                  index={ value }
                  disabled
                  onChangeIndex={ handleChangeIndex }
                >
                  {
                    [ ByTime(), ByNumber() ].map((ele, index) => (
                      <AppTabPanel key={ 'tp-' + index } value={ value } index={ index } dir={ theme.direction }>
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
          <Button onClick={ () => setTimeslotOpen(false) } variant="contained" color='default'>
            Close
          </Button>
          <Button onClick={ submit } variant="contained" color='primary'>
            Set
          </Button>
        </DialogActions>
      </Dialog>
    )

    function ByTime() {
      const headers = [ 'Day', ...TimeInterval.map(ti => ti.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })) ]

      const handleChange = (r: number, c: number) => (checked: boolean) => {
        setByTimeData([
          ...byTimeData.map((row, rindex) => rindex === r ? row.map((col, cindex) => cindex === c ? checked : col) : row)
        ])
      }

      return (
        <Table>
          <TableHead>
            <TableRow>
              { headers.map((h, index) => <TableCell key={ 'th-' + index }>{ h }</TableCell>) }
            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map((r, rindex) =>
              <TableRow hover key={ 'tr-' + rindex }>
                <TableCell>{ r }</TableCell>
                {
                  TimeInterval.map((ft, i) =>
                    <TableCell key={ 'bt-' + i }>
                      <Checkbox
                        onChange={ event => handleChange(rindex, i)(event.target.checked) }
                        inputProps={ { 'aria-label': 'primary checkbox' } }
                      />
                    </TableCell>
                  )
                }
              </TableRow>
            ) }
          </TableBody>
        </Table>
      )
    }

    function ByNumber() {
      const setWorking = (r: number) => (value: boolean) => {
        setIsWorking([
          ...isWorking.map((row, rindex) => rindex === r ? value : row)
        ])
      }

      const handleChange = (r: number, c: number) => (value: Date) => {
        setByNumberData([
          ...byNumberData.map((row, rindex) => rindex === r ? row.map((col, cindex) => cindex === c ? value : col) : row)
        ])
      }

      return (
        <Table>
          <TableBody>
            { rows.map((r, rindex) =>
              <TableRow hover key={ 'tr-' + rindex }>
                <TableCell>
                  <Checkbox
                    value={ isWorking[ rindex ] }
                    onChange={ event => setWorking(rindex)(event.target.checked) }
                    inputProps={ { 'aria-label': 'primary checkbox' } }
                  />
                </TableCell>
                <TableCell>{ r }</TableCell>
                <TableCell>
                  <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                    <KeyboardTimePicker
                      disableToolbar
                      margin="normal"
                      label='Start Time'
                      value={ byNumberData[ rindex ][ 0 ] }
                      onChange={ date => date && handleChange(rindex, 0)(date) }
                      KeyboardButtonProps={ {
                        'aria-label': 'change time',
                      } }
                    />
                  </MuiPickersUtilsProvider>
                </TableCell>
                <TableCell>
                  <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                    <KeyboardTimePicker
                      disableToolbar
                      margin="normal"
                      label='End Time Date'
                      value={ byNumberData[ rindex ][ 1 ] }
                      onChange={ date => date && handleChange(rindex, 1)(date) }
                      KeyboardButtonProps={ {
                        'aria-label': 'change time',
                      } }
                    />
                  </MuiPickersUtilsProvider>
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      )
    }
  }
}

export default withResubAutoSubscriptions(AppointmentPage)