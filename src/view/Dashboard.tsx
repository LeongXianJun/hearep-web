import React from 'react'
import { AppContainer, AppExpansion } from './common'
import { Grid, Typography, makeStyles, Theme, createStyles, 
  CardContent, Card, CardHeader, Divider } from '@material-ui/core'
import AC, { Appointment } from '../connections/AppointmentConnection'
import RC, { MedicationRecord } from '../connections/RecordConnection'

import NumGraph from '../resources/images/NumGraph.png'
import TimeGraph from '../resources/images/TimeGraph.png'

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

export default function Dashboard() {
  const styles = useStyles()

  const graphs: { title: string, data: JSX.Element }[] = [
    { title: 'Daily Appointment Handled', data: <img className={styles.img} src={NumGraph}/> },
    { title: 'Average Consultation Time per day', data: <img className={styles.img} src={TimeGraph}/> },
    { title: 'Average Waiting Time per day', data: <img className={styles.img} src={TimeGraph}/> },
    { title: 'Overall Patient Satisfaction per day', data: <img className={styles.img} src={NumGraph}/>}
  ]

  return(
    <AppContainer>
      <Grid container direction='row' justify='center' spacing={3}>
        <Grid item xs={12} sm={8} lg={9} style={{width: '100%', height: '100%'}}>
          <Card>
            <CardHeader
              title='Performance Analysis'
            />
            <CardContent>
              {
                graphs.map(({title, data}) => 
                  <AppExpansion title={title}>
                    { data }
                  </AppExpansion>
                )
              }
            </CardContent>
          </Card>
        </Grid>
        {
          AC.appointmentDB.length > 0 || RC.recordDB.length > 0
          ? <Grid item xs={12} sm={4} lg={3} style={{width: '100%'}}>
              { leftBar() }
            </Grid>
          : null
        }
      </Grid>
    </AppContainer>
  )
}

function leftBar() {
  return(
    <Card>
      <CardHeader
        title='Notification'
      />
      <CardContent>
        { notificationExp('Nearing Appointment', AC.appointmentDB) }
        { notificationExp('Medication Refill', RC.recordDB) }
      </CardContent>
    </Card>
  )
}

function notificationExp(title: string, data: (Appointment | MedicationRecord)[]) {
  const renderItem = (item: (Appointment | MedicationRecord), index: number) => 
    <>
      {
        index > 0
        ? <Divider/>
        : null
      }
      <Grid item>
        <Typography>{item.name}</Typography>
      </Grid>
    </>

  return(
    data.length > 0
    ? <AppExpansion title={title}>
        <Grid container direction='column' spacing={1}>
          {
            data.map(renderItem)
          }
        </Grid>
      </AppExpansion>
    : null
  )
}