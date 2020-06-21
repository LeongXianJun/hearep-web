import React, { FC, useState, useEffect } from 'react'
import { AppContainer, AppExpansion } from '../common'
import {
  Grid, IconButton, Card, CardHeader, CardContent,
  CardActions, Breadcrumbs, Typography, Link, Button,
  TextField, Table, TableBody, TableRow, TableCell
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import { Add as AddIcon, Create as CreateIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'

import { UserStore, HealthRecordStore, AppointmentStore, Appointment } from '../../stores'

interface PageProp {

}

const AddPrescriptionPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const patient = HealthRecordStore.getSelectedPatient()
  const appointment = AppointmentStore.getSelectedAppointment()
  const date = new Date()

  const [ illness, setIllness ] = useState('')
  const [ clinicalOpinion, setClinicalOpinion ] = useState('')
  const [ refillDate, setRefillDate ] = useState(new Date())
  const [ medicines, setMedicines ] = useState([ { medicine: '', dosage: 0, usage: '' } ])

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ isReady, patient, history ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username },
    { path: undefined, text: 'Add new Health Prescription' }
  ]

  const submit = () => {
    if (patient) {
      HealthRecordStore.insertHealthRecord({
        type: 'Health Prescription', patientId: patient.id,
        date, appId: appointment?.id, illness, clinicalOpinion
      }).then(async hr => {
        if (hr) {
          if (hr instanceof Error) {
            console.error(hr)
          } else {
            if (appointment)
              AppointmentStore.upApp(appointment, appointment.status, 'Completed')
            const validMedicines = medicines.filter(m => m.medicine !== '' && m.dosage !== undefined && m.usage !== '')
            if (validMedicines.length > 0) {
              await HealthRecordStore.insertHealthRecord({
                type: 'Medication Record', patientId: patient.id, date,
                prescriptionId: hr.hrid, refillDate, medications: validMedicines
              })
            }
          }
        }
      }).then(() => {
        history.goBack()
      })
    }
  }

  return (
    <AppContainer isLoading={ isReady === false }>
      <Breadcrumbs maxItems={ 3 } aria-label="breadcrumb">
        {
          breadcrumbs.map(({ path, text }, index, arr) => (
            index === arr.length - 1 || path === undefined
              ? <Typography key={ 'l-' + index } color="textPrimary">{ text }</Typography>
              : <Link key={ 'l-' + index } color="inherit" onClick={ () => history.push(path) }>
                { text }
              </Link>
          ))
        }
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={ 3 } style={ { marginTop: 5 } }>
        <Grid item xs={ 12 } md={ 4 }>
          { PrescriptionDetail() }
          { appointment ? AppointmentDetail(appointment) : undefined }
        </Grid>
        <Grid item xs={ 12 } md={ 8 }>
          { Medication() }
        </Grid>
      </Grid>
    </AppContainer>
  )

  function PrescriptionDetail() {
    return (
      <Card>
        <CardHeader title={ 'Prescription Information' } />
        <CardContent>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 }>
              <TextField
                variant='outlined'
                disabled
                value={ patient?.username }
                label="Patient"
                fullWidth
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                variant='outlined'
                disabled
                value={ date.toDateString() }
                label="Date"
                fullWidth
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                required
                variant='outlined'
                placeholder="Enter the main illness"
                label="Illness"
                fullWidth
                onChange={ event => setIllness(event.target.value) }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                required
                variant='outlined'
                placeholder="Enter your opinion on the illness"
                label="Clinical Opinion"
                fullWidth
                multiline
                rows={ 3 }
                rowsMax={ 5 }
                onChange={ event => setClinicalOpinion(event.target.value) }
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={ submit } startIcon={ <CreateIcon /> } color="primary" size='small'>
            Add new Health Prescription
            </Button>
        </CardActions>
      </Card>
    )
  }

  function AppointmentDetail(app: Appointment) {
    const details = [
      { field: 'Address', val: app.address },
      ...app.type === 'byTime'
        ? [
          { field: 'Date', val: app.time.toDateString() },
          { field: 'Time', val: app.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) }
        ]
        : app.type === 'byNumber'
          ? [
            { field: 'Date', val: app.date.toDateString() },
            { field: 'Turn', val: app.turn + 1 }
          ]
          : []
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion title={ 'Appointment Detail' }>
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

  function Medication() {
    const addMedicine = () => {
      setMedicines([ ...medicines, { medicine: '', dosage: 0, usage: '' } ])
    }

    const removeMedicine = (num: number) => {
      setMedicines([ ...medicines.slice(0, num), ...medicines.slice(num + 1) ])
    }

    const updateMedicine = (num: number, val: string) => {
      setMedicines([ ...medicines.slice(0, num), { ...medicines[ num ], 'medicine': val }, ...medicines.slice(num + 1) ])
    }

    const updateDosage = (num: number, val: number) => {
      setMedicines([ ...medicines.slice(0, num), { ...medicines[ num ], 'dosage': val }, ...medicines.slice(num + 1) ])
    }

    const updateUsage = (num: number, val: string) => {
      setMedicines([ ...medicines.slice(0, num), { ...medicines[ num ], 'usage': val }, ...medicines.slice(num + 1) ])
    }

    return (
      <Card>
        <CardHeader
          title={ 'Medication Record' }
          action={
            <IconButton onClick={ addMedicine }>
              <AddIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Grid container direction='column' spacing={ 2 }>
            {
              medicines.map((medicine, index) =>
                <Grid key={ 'medicine-' + index } item container direction='row' spacing={ 1 } xs={ 12 }>
                  <Grid item container direction='row' spacing={ 1 } xs={ 10 } sm={ 11 }>
                    <Grid item xs={ 12 } sm={ 4 }>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Medicine"
                        fullWidth
                        label={ "Medicine " + (index + 1) }
                        onChange={ event => updateMedicine(index, event.target.value) }
                      />
                    </Grid>
                    <Grid item xs={ 6 } sm={ 4 }>
                      <TextField
                        required
                        variant="outlined"
                        type="number"
                        placeholder="Enter the Dosage"
                        fullWidth
                        label={ "Dosage " + (index + 1) }
                        onChange={ event => updateDosage(index, Number(event.target.value)) }
                      />
                    </Grid>
                    <Grid item xs={ 6 } sm={ 4 }>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Usage"
                        fullWidth
                        label={ "Usage " + (index + 1) }
                        onChange={ event => updateUsage(index, event.target.value) }
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs alignContent='center' justify='center'>
                    <IconButton onClick={ () => removeMedicine(index) }>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )
            }
            <Grid item xs={ 12 }>
              <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label='Refill Date'
                  value={ refillDate }
                  onChange={ date => date && setRefillDate(date) }
                  KeyboardButtonProps={ {
                    'aria-label': 'change date',
                  } }
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

export default withResubAutoSubscriptions(AddPrescriptionPage)