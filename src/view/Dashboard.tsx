import React, { FC } from 'react'
import { AppContainer, AppExpansion } from './common'
import {
  Grid, makeStyles, Theme, createStyles, CardContent,
  Card, CardHeader, Table, TableBody, TableRow, TableCell
} from '@material-ui/core'
import AC, { Appointment } from '../connections/AppointmentConnection'
import RC, { Record } from '../connections/RecordConnection'

import { NumGraph, TimeGraph } from '../resources/images'

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

  const graphs: { title: string, graph: JSX.Element }[] = [
    { title: 'Daily Appointment Handled', graph: <img className={ styles.img } alt='num' src={ NumGraph } /> },
    { title: 'Average Consultation Time per day', graph: <img className={ styles.img } alt='time' src={ TimeGraph } /> },
    { title: 'Average Waiting Time per day', graph: <img className={ styles.img } alt='time' src={ TimeGraph } /> },
    { title: 'Overall Patient Satisfaction per day', graph: <img className={ styles.img } alt='num' src={ NumGraph } /> }
  ]

  return (
    <AppContainer>
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
          AC.appointmentDB.length > 0 || RC.recordDB.length > 0
            ? <Grid item xs={ 12 } sm={ 4 } lg={ 3 } style={ { width: '100%' } }>
              { leftBar() }
            </Grid>
            : null
        }
      </Grid>
    </AppContainer>
  )
}

function leftBar() {
  return (
    <Card>
      <CardHeader
        title='Notification'
      />
      <CardContent>
        { notificationExp('Nearing Appointments', AC.nearing) }
        { notificationExp('Medication Refill Reminder', RC.recordDB.filter(r => r.type === 'medication record')) }
      </CardContent>
    </Card>
  )
}

function notificationExp(title: string, data: (Appointment | Record)[]) {
  return (
    data.length > 0
      ? <AppExpansion title={ title }>
        <Table>
          <TableBody>
            {
              data.map(({ name }, index) =>
                <TableRow key={ name + 'row-' + index }>
                  <TableCell>{ name }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>
      : null
  )
}

export default Dashboard