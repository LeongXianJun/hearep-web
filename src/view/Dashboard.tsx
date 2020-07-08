import React, { FC, useEffect, useState } from 'react'
import { AppContainer, AppExpansion, LineGraphWithZoom } from './common'
import {
  Grid, CardContent, Card, CardHeader, Table,
  TableBody, TableRow, TableCell, Typography
} from '@material-ui/core'
import { withResubAutoSubscriptions } from 'resub'

import { UserStore, MedicationRecord, AppointmentStore, Appointment, AnalysisStore } from '../stores'

interface PageProp {

}

const Dashboard: FC<PageProp> = () => {
  const isReady = UserStore.ready()
  const patients = UserStore.getPatients()
  const appointments = AppointmentStore.getGroupedAppointments()
  const performanceAnalysis = AnalysisStore.getAnalysis()
  const { HandledApp, NewApp, AverageWaitingTime } = performanceAnalysis

  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    if (isReady && isLoading) {
      Promise.all([
        UserStore.fetchAllPatients(),
        AppointmentStore.fetchAllAppointments(),
        AnalysisStore.fetchPerformanceAnalysis()
      ]).catch(err => console.log(err))
        .finally(() => setIsLoading(false))
    }
  }, [ isReady, isLoading ])

  const graphs: { title: string, graph: JSX.Element, defaultExpanded?: boolean }[] = [
    {
      title: 'Daily Appointment Handled',
      graph: <LineGraphWithZoom data={ HandledApp.map(a => ({ x: a.day, y: a.count })) } minZoom={ 2 } showSymbol yLabel='Count' />,
      defaultExpanded: true
    },
    {
      title: 'Daily New Appointment',
      graph: <LineGraphWithZoom data={ NewApp.map(a => ({ x: a.day, y: a.count })) } minZoom={ 2 } showSymbol yLabel='Count' />
    },
    {
      title: 'Average Waiting Time per day',
      graph: <LineGraphWithZoom data={ AverageWaitingTime.map(a => ({ x: a.day, y: a.averageTime })) } minZoom={ 2 } showSymbol yLabel='Average Time' />
    }
  ]

  return (
    <AppContainer isLoading={ isLoading }>
      <Grid container direction='row' justify='center' spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 8 } lg={ 9 } style={ { width: '100%', height: '100%' } }>
          <Card>
            <CardHeader
              title='Performance Analysis'
            />
            <CardContent>
              {
                graphs.map(({ title, graph: data, defaultExpanded }, index) =>
                  <AppExpansion title={ title } key={ 'exp-' + index } defaultExpanded={ defaultExpanded }>
                    { data }
                  </AppExpansion>
                )
              }
            </CardContent>
          </Card>
        </Grid>
        { <Grid item xs={ 12 } sm={ 4 } lg={ 3 } style={ { width: '100%' } }>
          { leftBar() }
        </Grid>
        }
      </Grid>
    </AppContainer>
  )

  function leftBar() {
    const allApp = [ ...appointments[ 'Waiting' ], ...appointments[ 'Accepted' ] ]
    return (
      <Card>
        <CardHeader
          title='Notification'
        />
        <CardContent>
          {
            allApp.length > 0
              ? notificationExp('Nearing Appointments', allApp)
              : <Typography>{ 'No new notification' }</Typography>
          }
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