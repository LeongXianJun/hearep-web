import React, { FC, useEffect } from 'react'
import {
  Grid, Card, CardHeader, CardContent, Breadcrumbs,
  Typography, Link, Table, TableBody, TableRow, TableCell
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'

import { AppContainer, AppExpansion, AppTable } from '../common'
import { UserStore, HealthRecordStore, LabTestResult, AppointmentStore } from '../../stores'

interface PageProp {

}

const LabTestPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const patient = HealthRecordStore.getSelectedPatient()
  const record = HealthRecordStore.getSelectedLTRRecord()
  const appointments = AppointmentStore.getGroupedAppointments()
  const patientAppointment = AppointmentStore.getPatientAppointment()
  const { Completed } = appointments

  useEffect(() => {
    if (isReady) {
      if (patient === undefined) {
        history.replace('/patient')
      }
      if (record === undefined) {
        history.replace('/patient/detail')
      }
    }
  }, [ isReady, patient, record, history ])

  useEffect(() => {
    if (isReady && record?.appId !== undefined && record.appId !== patientAppointment?.id) {
      const target = Completed.find(app => app.id === record.appId)
      if (target === undefined) {
        AppointmentStore.fetchPatientAppointment(record.appId)
      }
    }
  }, [ isReady, record, Completed, patientAppointment ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username },
    { path: '/labTest', text: 'Lab Test on ' + record?.date.toDateString() }
  ]

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
      {
        record
          ? <Grid container direction='row' justify='center' spacing={ 3 } style={ { marginTop: 5 } }>
            <Grid item xs={ 12 } md={ 4 }>
              { LabTestDetail({ detail: record }) }
              {
                record.appId !== undefined
                  ? AppointmentDetail(record.appId)
                  : undefined
              }
            </Grid>
            <Grid item xs={ 12 } md={ 8 }>
              { LabTestResult({ result: record.data }) }
            </Grid>
          </Grid>
          : <></>
      }
    </AppContainer>
  )

  function LabTestDetail(props: LabTestDetailProps) {
    const { detail: data } = props
    const details = [
      { field: 'Patient Name', val: patient?.username },
      { field: 'Test Title', val: data.title },
      { field: 'Test Date', val: data.date.toDateString() },
      { field: 'Comment', val: data.comment }
    ]

    return (
      <Card>
        <CardHeader title={ 'Lab Test Information' } />
        <CardContent>
          <Grid container direction='column' spacing={ 2 }>
            {
              details.map(({ field, val }) =>
                <Grid item container direction='row' xs={ 12 }>
                  <Grid item xs={ 12 } sm={ 4 }>
                    <Typography>{ field }</Typography>
                  </Grid>
                  <Grid item xs={ 12 } sm={ 8 }>
                    <Typography>{ val }</Typography>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </CardContent>
      </Card>

    )
  }

  function AppointmentDetail(appId: string) {
    const appointment = Completed.find(app => app.id === appId) ?? patientAppointment
    const details = [
      { field: 'Address', val: appointment?.address },
      { field: 'Date', val: appointment?.type === 'byTime' ? appointment.time.toDateString() : appointment?.date.toDateString() },
      { field: 'Time', val: appointment?.type === 'byTime' ? appointment.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) : undefined }
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion
        title={ 'Appointment Detail' }
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'arow-' + index }>
                  <TableCell>{ field }</TableCell>
                  <TableCell>{ val }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>
    )
  }

  function LabTestResult(props: LabTestResultProps) {
    const { result } = props
    const columns = [
      { title: 'Test Component', field: 'field' },
      { title: 'Value', field: 'value' },
      { title: 'Normal Range', field: 'normalRange' }
    ]
    return (
      <AppTable
        title={ 'Lab Test Result' }
        columns={ columns }
        data={ result }
      />
    )
  }
}

interface LabTestDetailProps {
  detail: LabTestResult
}

interface LabTestResultProps {
  result: LabTestResult[ 'data' ]
}

export default withResubAutoSubscriptions(LabTestPage)