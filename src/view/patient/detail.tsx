import React from 'react'
import { AppContainer, AppExpansion } from '../common'
import { makeStyles, Theme, createStyles, Card, Grid, 
  Breadcrumbs, Link, Typography, TableBody, Table, 
  TableRow, TableCell, CardHeader, CardContent, Button } from '@material-ui/core'
import UC, { User } from '../../connections/UserConnection'
import AC from '../../connections/AppointmentConnection'
import RC, { Record } from '../../connections/RecordConnection'
import { useHistory } from 'react-router-dom'

import maleAvatar from '../../resources/images/maleAvatar.png'
import femaleAvatar from '../../resources/images/femaleAvatar.png'
import AmountGraph from '../../resources/images/AmountGraph.png'

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

export default function PatientDetailPage() {
  const styles = useStyles()
  const history = useHistory()
  const patient = UC.selectedPatient

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.detail?.fullname ?? patient?.username }
  ]

  const appointmentByNumber = AC.appointmentDB
    .filter(a => a.name === patient?.detail?.fullname && a.medicalStaff === UC.currentUser?.detail?.fullname)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .find(a => a.type === 'byNumber')

  const viewPrescription = (record: Record) => {
    RC.selectedRecord = record
    history.push('/prescription')
  }

  const viewLabTest = (record: Record) => {
    RC.selectedRecord = record
    history.push('/labTest')
  }

  return(
    <AppContainer>
      <Breadcrumbs maxItems={3} aria-label="breadcrumb">
        {
          breadcrumbs.map(({path, text}, index, arr) => (
            index === arr.length - 1
            ? <Typography key={'l-' + index} color="textPrimary">{text}</Typography>
            : <Link key={'l-' + index} color="inherit" href={path}>
                {text}
              </Link>
          ))
        }        
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={3} style={{marginTop: 5}}>
        <Grid item xs={12} md={6}>
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
            actions={<Button size="small" onClick={() => history.push('/prescription/add')}>Add</Button>}
          >
            <Table>
              <TableBody>
                {
                  RC.recordDB.filter(a => a.name === patient?.detail?.fullname && a.type === 'health prescription')
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((record, index) => 
                      record.type === 'health prescription'
                      ? <TableRow key={'row-' + index} hover onClick={() => viewPrescription(record)}>
                          <TableCell>{ record.illness }</TableCell>
                          <TableCell>{ record.date.toDateString() }</TableCell>
                        </TableRow>
                      : undefined
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
          <AppExpansion title='Lab Test Result'>
            <Table>
              <TableBody>
                {
                  RC.recordDB.filter(a => a.name === patient?.detail?.fullname && a.type === 'lab test result')
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((record, index) => 
                      record.type === 'lab test result'
                      ? <TableRow key={'row-' + index} hover onClick={() => viewLabTest(record)}>
                          <TableCell>{ record.title }</TableCell>
                          <TableCell>{ record.date.toDateString() }</TableCell>
                        </TableRow>
                      : undefined
                    )
                }
              </TableBody>
            </Table>
          </AppExpansion>
        </Grid>
        <Grid item xs={12} md={6}>
          {
            appointmentByNumber?.type === 'byNumber'
            ? <AppExpansion
                title='Consultation Turn'
                defaultExpanded
              >
                <Typography>{appointmentByNumber.turn}</Typography>
              </AppExpansion>
            : undefined
          }
          <AppExpansion title='Upcoming Appointments'>
            <Table>
              <TableBody>
                {
                  AC.appointmentDB.filter(a => a.name === patient?.detail?.fullname && a.medicalStaff === UC.currentUser?.detail?.fullname && a.type === 'byTime')
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((appointment, index) => 
                      appointment.type === 'byTime'
                      ? <TableRow hover key={'row-' + index}>
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
            <Grid container direction='column' spacing={1}>
              {
                [
                  { title: 'Blood Sugar Level', graph: <img className={styles.img} alt='amount' src={AmountGraph}/> },
                  { title: 'Blood Pressure', graph: <img className={styles.img} alt='amount' src={AmountGraph}/> },
                  { title: 'BMI', graph: <img className={styles.img} alt='amount' src={AmountGraph}/> }
                ].map(({title, graph}, index) => 
                  <Grid key={'graph-' + index} item xs={12}>
                    <Card>
                      <CardHeader title={title}/>
                      <CardContent>{graph}</CardContent>
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

function PatientProfile(patient: User) {
  const {detail} = patient
  
  const details = [
    { field: 'Name', val: detail?.fullname ?? patient.username },
    { field: 'Age', val: detail?.age },
    { field: 'Gender', val: detail?.gender },
    { field: 'Email', val: patient.email },
    { field: 'Alternative Email', val: detail?.contacts?.find(c=> c.type === 'email')?.value },
    { field: 'Contact Number', val: detail?.contacts?.find(c=> c.type === 'phone')?.value }
  ].filter(({val}) => val !== undefined && val !== '')

  return (
    <Grid container direction='row' spacing={3}>
      <Grid item xs={12} sm={4}>
        <img style={{ margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%' }} alt='num' src={detail?.gender === 'F'? femaleAvatar: maleAvatar}/>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Table>
          <TableBody>
            {
              details.map(({field, val}, index) => 
                <TableRow hover key={'row-' + index}>
                  <TableCell>{field}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}