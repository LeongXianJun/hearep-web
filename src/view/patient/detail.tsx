import React, { FC, useEffect } from 'react'
import {
  makeStyles, Theme, createStyles, Card, Grid,
  Breadcrumbs, Link, Typography, TableBody, Table,
  TableRow, TableCell, CardHeader, CardContent, Button
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'

import { AppContainer, AppExpansion } from '../common'
import AC from '../../connections/AppointmentConnection'
import { UserStore, HealthRecordStore, Patient, HealthPrescription, LabTestResult } from '../../stores'
import { maleAvatar, femaleAvatar, AmountGraph } from '../../resources/images'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    }
  }),
)

interface PageProp {

}

const PatientDetailPage: FC<PageProp> = () => {
  const styles = useStyles()
  const history = useHistory()
  const isReady = UserStore.ready()
  const currentUser = UserStore.getUser()
  const patient = HealthRecordStore.getSelectedPatient()
  const healthRecords = HealthRecordStore.getHealthRecords()
  const { healthPrescriptions, labTestResults } = healthRecords

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ patient, isReady ])

  useEffect(() => {
    if (patient) {
      HealthRecordStore.fetchPatientRecords(patient.id)
        .catch(err => {
          if (err.message.includes('No more record') === false) {
            console.error(err)
          }
        })
    }
  }, [ patient ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username }
  ]

  const appointmentByNumber = AC.appointmentDB
    .filter(a => a.name === patient?.username && a.medicalStaff === currentUser?.username)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .find(a => a.type === 'byNumber')

  const viewPrescription = (record: HealthPrescription) => {
    HealthRecordStore.setSelectedRecord(record)
    history.push('/prescription')
  }

  const viewLabTest = (record: LabTestResult) => {
    HealthRecordStore.setSelectedRecord(record)
    history.push('/labTest')
  }

  return (
    <AppContainer isLoading={ isReady === false }>
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
            actions={ <Button size="small" onClick={ () => history.push('/prescription/add') }>Add</Button> }
          >
            <Table>
              <TableBody>
                {
                  healthPrescriptions
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((record, index) =>
                      <TableRow key={ 'row-' + index } hover onClick={ () => viewPrescription(record) }>
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
            actions={ <Button size="small" onClick={ () => history.push('/labTest/add') }>Add</Button> }
          >
            <Table>
              <TableBody>
                {
                  labTestResults
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((record, index) =>
                      <TableRow key={ 'row-' + index } hover onClick={ () => viewLabTest(record) }>
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
                <Typography>{ appointmentByNumber.turn }</Typography>
              </AppExpansion>
              : undefined
          }
          <AppExpansion title='Upcoming Appointments'>
            <Table>
              <TableBody>
                {
                  AC.appointmentDB.filter(a => a.name === patient?.username && a.medicalStaff === currentUser?.username && a.type === 'byTime')
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((appointment, index) =>
                      appointment.type === 'byTime'
                        ? <TableRow hover key={ 'row-' + index }>
                          <TableCell>{ appointment.date.toDateString() }</TableCell>
                          <TableCell>{ appointment.time }</TableCell>
                        </TableRow>
                        : undefined
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
          <AppExpansion title='Health Analysis'>
            <Grid container direction='column' spacing={ 1 }>
              {
                [
                  { title: 'Blood Sugar Level', graph: <img className={ styles.img } alt='amount' src={ AmountGraph } /> },
                  { title: 'Blood Pressure', graph: <img className={ styles.img } alt='amount' src={ AmountGraph } /> },
                  { title: 'BMI', graph: <img className={ styles.img } alt='amount' src={ AmountGraph } /> }
                ].map(({ title, graph }, index) =>
                  <Grid key={ 'graph-' + index } item xs={ 12 }>
                    <Card>
                      <CardHeader title={ title } />
                      <CardContent>{ graph }</CardContent>
                    </Card>
                  </Grid>
                )
              }
            </Grid>
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