import React, { FC, useEffect } from 'react'
import { AppContainer, AppExpansion } from './common'
import {
  Grid, makeStyles, Theme, createStyles, CardContent,
  Card, CardHeader, Table, TableBody, TableRow, TableCell
} from '@material-ui/core'
import { withResubAutoSubscriptions } from 'resub'

import { NumGraph, TimeGraph } from '../resources/images'
import { UserStore, HealthRecordStore, MedicationRecord, AppointmentStore, Appointment } from '../stores'

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

const Dashboard: FC<PageProp> = () => {
  const styles = useStyles()
  const isReady = UserStore.ready()
  const patients = UserStore.getPatients()
  // nid to replace with something
  const records = HealthRecordStore.getHealthRecords()
  const isAppStoreReady = AppointmentStore.ready()
  const appointments = AppointmentStore.getGroupedAppointments()

  useEffect(() => {
    if (isReady && patients.length === 0)
      UserStore.fetchAllPatient()
        .catch(err => console.log(err))
  }, [ isReady, patients ])

  useEffect(() => {
    if (isReady && isAppStoreReady === false)
      AppointmentStore.fetchAllAppointments()
        .catch(err => console.log(err))
  }, [ isReady, appointments, isAppStoreReady ])

  const graphs: { title: string, graph: JSX.Element }[] = [
    { title: 'Daily Appointment Handled', graph: <img className={ styles.img } alt='num' src={ NumGraph } /> },
    { title: 'Average Consultation Time per day', graph: <img className={ styles.img } alt='time' src={ TimeGraph } /> },
    { title: 'Average Waiting Time per day', graph: <img className={ styles.img } alt='time' src={ TimeGraph } /> },
    { title: 'Overall Patient Satisfaction per day', graph: <img className={ styles.img } alt='num' src={ NumGraph } /> }
  ]

  return (
    <AppContainer isLoading={ isReady === false }>
      <Grid container direction='row' justify='center' spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 8 } lg={ 9 } style={ { width: '100%', height: '100%' } }>
          <Card>
            <CardHeader
              title='Performance Analysis'
            />
            <CardContent>
              {
                graphs.map(({ title, graph: data }, index) =>
                  <AppExpansion title={ title } key={ 'exp-' + index }>
                    { data }
                  </AppExpansion>
                )
              }
            </CardContent>
          </Card>
        </Grid>
        {
          appointments[ 'Waiting' ].length > 0 || appointments[ 'Accepted' ].length > 0 || records[ 'healthPrescriptions' ].length > 0 || records[ 'labTestResults' ].length > 0
            ? <Grid item xs={ 12 } sm={ 4 } lg={ 3 } style={ { width: '100%' } }>
              { leftBar() }
            </Grid>
            : null
        }
      </Grid>
    </AppContainer>
  )

  function leftBar() {
    return (
      <Card>
        <CardHeader
          title='Notification'
        />
        <CardContent>
          { notificationExp('Nearing Appointments', [ ...appointments[ 'Waiting' ], ...appointments[ 'Accepted' ] ]) }
          { notificationExp('Medication Refill Reminder', records[ 'healthPrescriptions' ].flatMap(hp => hp.medicationRecords)) }
        </CardContent>
      </Card>
    )
  }

  function notificationExp(title: string, data: (Appointment | MedicationRecord)[]) {
    return (
      data.length > 0
        ? <AppExpansion title={ title }>
          <Table>
            <TableBody>
              {
                data.map(({ date, patientId }, index) => {
                  const patient = patients.find(p => p.id === patientId)
                  return <TableRow key={ 'row-' + index }>
                    <TableCell>{ patient?.username }</TableCell>
                    <TableCell>{ date.toDateString() }</TableCell>
                  </TableRow>
                })
              }
            </TableBody>
          </Table>
        </AppExpansion>
        : null
    )
  }
}

export default withResubAutoSubscriptions(Dashboard)