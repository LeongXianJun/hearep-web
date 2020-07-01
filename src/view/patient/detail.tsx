import React, { FC, useEffect, useState } from 'react'
import { AppContainer, AppExpansion, LineGraph } from '../common'
import {
  Grid, Breadcrumbs, Link, Typography, TableBody,
  Table, TableRow, TableCell, Button, TableHead
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'

import { maleAvatar, femaleAvatar } from '../../resources/images'
import {
  UserStore, HealthRecordStore, Patient, AppointmentStore,
  Appointment, HealthRecord, HealthAnalysisStore
} from '../../stores'

interface PageProp {

}

const PatientDetailPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const patient = HealthRecordStore.getSelectedPatient()
  const healthRecords = HealthRecordStore.getHealthRecords()
  const appointments = AppointmentStore.getGroupedAppointments()
  const healthConditions = HealthAnalysisStore.getHealthCondition()
  const { healthPrescriptions, labTestResults } = healthRecords
  const Accepted = appointments.Accepted.filter(app => app.patientId === patient?.id)

  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ patient, isReady, history ])

  useEffect(() => {
    if (isReady && isLoading && patient) {
      Promise.all([
        HealthRecordStore.fetchPatientRecords(patient.id),
        HealthAnalysisStore.fetchHealthAnalysis(patient.id),
        AppointmentStore.fetchAllAppointments()
      ]).then(() => setIsLoading(false))
        .catch(err => {
          if (err.message.includes('No more record') === false) {
            console.error(err)
          }
        })
    }
  }, [ isReady, isLoading, patient ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username }
  ]

  const appointmentByNumber = appointments.Waiting
    .filter(app => app.patientId === patient?.id)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .find(() => true)

  const view = (type: 'Health Prescription' | 'Lab Test Result', record: HealthRecord) => () =>
    Promise.resolve(
      HealthRecordStore.setSelectedRecord(record)
    ).then(() =>
      type === 'Health Prescription'
        ? history.push('/prescription')
        : history.push('/labTest')
    )


  const insertHealthRecord = (appointment: Appointment, type: 'Health Prescription' | 'Lab Test Result') => () =>
    Promise.resolve(
      AppointmentStore.setSelectedAppointment(appointment)
    ).then(() =>
      type === 'Health Prescription'
        ? history.push('/prescription/add')
        : history.push('/labTest/add')
    )

  return (
    <AppContainer isLoading={ isLoading }>
      <Breadcrumbs maxItems={ 3 } aria-label="breadcrumb">
        {
          breadcrumbs.map(({ path, text }, index, arr) => (
            index === arr.length - 1
              ? <Typography key={ 'l-' + index } color="textPrimary">{ text }</Typography>
              : <Link key={ 'l-' + index } color="inherit" onClick={ () => history.push(path) }>
                { text }
              </Link>
          ))
        }
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={ 3 } style={ { marginTop: 5 } }>
        <Grid item xs={ 12 } md={ 6 }>
          {
            patient
              ? <AppExpansion
                title='Patient Information'
                defaultExpanded
              >
                { PatientProfile(patient) }
              </AppExpansion>
              : null
          }
          <AppExpansion
            title='Medical Prescription'
            actions={ <Button size="small" onClick={ () => history.push('/prescription/add') } color='primary'>{ 'Add' }</Button> }
          >
            <Table>
              <TableBody>
                {
                  healthPrescriptions
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((record, index) =>
                      <TableRow key={ 'row-' + index } hover onClick={ view('Health Prescription', record) }>
                        <TableCell>{ record.illness }</TableCell>
                        <TableCell>{ record.date.toDateString() }</TableCell>
                      </TableRow>
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
          <AppExpansion
            title='Lab Test Result'
            actions={ <Button size="small" onClick={ () => history.push('/labTest/add') } color='primary'>{ 'Add' }</Button> }
          >
            <Table>
              <TableBody>
                {
                  labTestResults
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((record, index) =>
                      <TableRow key={ 'row-' + index } hover onClick={ view('Lab Test Result', record) }>
                        <TableCell>{ record.title }</TableCell>
                        <TableCell>{ record.date.toDateString() }</TableCell>
                      </TableRow>
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
        </Grid>
        <Grid item xs={ 12 } md={ 6 }>
          {
            appointmentByNumber?.type === 'byNumber'
              ? <AppExpansion
                title='Consultation Turn'
                defaultExpanded
              >
                <Grid container direction='column' spacing={ 1 }>
                  <Grid item>
                    <Typography>{ 'Date: ' + appointmentByNumber.date.toDateString() }</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{ 'Address: ' + appointmentByNumber.address }</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{ 'Turn: ' + (appointmentByNumber.turn + 1) }</Typography>
                  </Grid>
                  <Grid item container spacing={ 1 }>
                    <Button onClick={ insertHealthRecord(appointmentByNumber, 'Health Prescription') } variant='contained' color='primary'>{ 'Insert Health Prescription' }</Button>
                    <Button onClick={ insertHealthRecord(appointmentByNumber, 'Lab Test Result') } variant='contained' color='primary' style={ { marginLeft: 10 } }>{ 'Insert Lab Test Result' }</Button>
                  </Grid>
                </Grid>
              </AppExpansion>
              : undefined
          }
          <AppExpansion title='Upcoming Appointments'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{ 'Date' }</TableCell>
                  <TableCell>{ 'Time' }</TableCell>
                  <TableCell>{ 'Action' }</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Accepted
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((appointment, index) =>
                      appointment.type === 'byTime'
                        ? <TableRow hover key={ 'row-' + index }>
                          <TableCell>{ appointment.time.toDateString() }</TableCell>
                          <TableCell>{ appointment.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) }</TableCell>
                          <TableCell>
                            <Grid container spacing={ 1 }>
                              <Grid item xs={ 6 }>
                                <Button size="small" onClick={ insertHealthRecord({ ...appointment }, 'Health Prescription') } variant='contained' color='primary'>
                                  { 'Insert Health Prescription' }
                                </Button>
                              </Grid>
                              <Grid item xs={ 6 }>
                                <Button size="small" onClick={ insertHealthRecord({ ...appointment }, 'Lab Test Result') } variant='contained' color='primary' style={ { marginLeft: 10 } }>
                                  { 'Insert Lab Test Result' }
                                </Button>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        : undefined
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
          <AppExpansion title='Health Analysis' isLoading={ isLoading }>
            {
              [
                {
                  title: 'Sickness Frequency',
                  graph: <LineGraph data={ healthConditions[ 'Sickness Frequency' ].map(a => ({ x: a.month, y: a.count })) } showSymbol yLabel='Turn' />,
                  defaultExpended: true
                },
                {
                  title: 'Blood Sugar Level',
                  graph: <LineGraph data={ healthConditions[ 'Blood Sugar Level' ].map(a => ({ x: a.day, y: a.length > 0 ? a.count / a.length : 0 })) } showSymbol yLabel='Count' />
                },
                {
                  title: 'Blood Pressure',
                  graph: <LineGraph data={ healthConditions[ 'Blood Pressure Level' ].map(a => ({ x: a.day, y: a.length > 0 ? a.count / a.length : 0 })) } showSymbol yLabel='Count' />
                },
                {
                  title: 'BMI',
                  graph: <LineGraph data={ healthConditions[ 'BMI' ].map(a => ({ x: a.day, y: a.length > 0 ? a.count / a.length : 0 })) } showSymbol yLabel='Count' />
                }
              ].map(({ title, graph, defaultExpended }, index) =>
                <AppExpansion key={ 'graph-' + index } title={ title } defaultExpanded={ defaultExpended }>
                  { graph }
                </AppExpansion>
              )
            }
          </AppExpansion>
        </Grid>
      </Grid>
    </AppContainer>
  )
}

function PatientProfile(patient: Patient) {
  const { username, dob, gender, email, phoneNumber, occupation } = patient

  const age = (birthdate: Date) => {
    return new Date().getUTCFullYear() - birthdate.getUTCFullYear()
  }

  const details = [
    { field: 'Name', val: username },
    { field: 'Age', val: age(dob) },
    { field: 'Gender', val: gender },
    { field: 'Email', val: email },
    { field: 'Contact Number', val: phoneNumber },
    { field: 'Occupation', val: occupation },
  ].filter(({ val }) => val !== undefined && val !== '')

  return (
    <Grid container direction='row' spacing={ 3 }>
      <Grid item xs={ 12 } sm={ 4 }>
        <img style={ { margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%' } } alt='num' src={ gender === 'F' ? femaleAvatar : maleAvatar } />
      </Grid>
      <Grid item xs={ 12 } sm={ 8 }>
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'row-' + index }>
                  <TableCell>{ field }</TableCell>
                  <TableCell>{ val }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

export default withResubAutoSubscriptions(PatientDetailPage)