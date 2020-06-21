import React, { FC, useState, useEffect } from 'react'
import { AppContainer, AppExpansion } from '../common'
import {
  Grid, useMediaQuery, Divider, IconButton,
  useTheme, Table, TableBody, TableRow, TableCell,
  TableHead, Breadcrumbs, Typography, Link, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons'

import {
  UserStore, HealthRecordStore, HealthPrescription, MedicationRecord, AppointmentStore
} from '../../stores'

interface PageProp {

}
const PrescriptionPage: FC<PageProp> = () => {
  const theme = useTheme()
  const history = useHistory()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const isReady = UserStore.ready()
  const patient = HealthRecordStore.getSelectedPatient()
  const record = HealthRecordStore.getSelectedHPRecord()
  const appointments = AppointmentStore.getGroupedAppointments()
  const patientAppointment = AppointmentStore.getPatientAppointment()
  const { Completed } = appointments

  const [ open, setOpen ] = useState(false)

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
    { path: '/prescription', text: 'Health Prescription on ' + record?.date.toDateString() }
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
            <Grid item xs={ 12 } md={ 6 }>
              <AppExpansion
                title='Prescription Information'
                defaultExpanded
              >
                { PrescriptionInfo(record) }
              </AppExpansion>
              {
                record.appId !== undefined
                  ? AppointmentDetail(record.appId)
                  : undefined
              }
            </Grid>
            <Grid item xs={ 12 } md={ 6 }>
              <AppExpansion
                title='Medication Records'
                defaultExpanded
                actions={ <Button size="small" onClick={ () => setOpen(true) }>Add</Button> }
              >
                <Grid container direction='column' spacing={ 1 }>
                  {
                    record.medicationRecords
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map(medicationRecord)
                  }
                </Grid>
              </AppExpansion>
            </Grid>
          </Grid>
          : <></>
      }
      { AddMedicationRecordDialog() }
    </AppContainer>
  )

  function PrescriptionInfo(record: HealthPrescription) {
    const details = [
      { field: 'Patient Name', val: patient?.username },
      { field: 'Consultation Date', val: record.date.toDateString() },
      { field: 'Illness', val: record.illness },
      { field: 'Clinical Opinion', val: record.clinicalOpinion },
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <Table>
        <TableBody>
          {
            details.map(({ field, val }, index) =>
              <TableRow hover key={ 'drow-' + index }>
                <TableCell>{ field }</TableCell>
                <TableCell>{ val }</TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
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

  function medicationRecord(mr: MedicationRecord, index: number) {
    return (
      <Grid key={ 'md-' + index } item xs={ 12 }>
        <AppExpansion
          title={ 'Medication Record on ' + mr.date.toDateString() }
          subtitle={ 'Refill on ' + mr.refillDate.toDateString() }
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{ 'Medicine' }</TableCell>
                <TableCell>{ 'Dosage' }</TableCell>
                <TableCell>{ 'Usage' }</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                mr.medications.map(({ medicine, dosage, usage }, rowIndex) =>
                  <TableRow hover key={ 'mrrow-' + rowIndex }>
                    <TableCell>{ medicine }</TableCell>
                    <TableCell>{ dosage }</TableCell>
                    <TableCell>{ usage }</TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </AppExpansion>
      </Grid>
    )
  }

  function AddMedicationRecordDialog() {
    const [ refillDate, setRefillDate ] = useState(new Date())
    const [ medicines, setMedicines ] = useState([ { medicine: '', dosage: 0, usage: '' } ])
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

    const cancel = () => {
      setOpen(false)
      setMedicines([ { medicine: '', dosage: 0, usage: '' } ])
    }

    const addMedicationRecord = () => {
      if (patient && record) {
        HealthRecordStore.insertHealthRecord({
          type: 'Medication Record', prescriptionId: record.id,
          date: new Date(), patientId: patient?.id, refillDate,
          medications: medicines
        }).then(() => {
          setOpen(false)
        })
      }
    }

    return (
      <Dialog open={ open } onClose={ cancel } fullScreen={ fullScreen } maxWidth='md'>
        <DialogTitle>
          <Grid container direction='row'>
            <Grid item xs={ 8 }>
              <Typography variant='h4'>{ 'New Medication Record' }</Typography>
            </Grid>
            <Grid item xs={ 4 }>
              <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  size='small'
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
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container direction='column'>
            {
              medicines.map((medicine, index) =>
                <Grid key={ 'medicine-' + index } style={ { marginBottom: 5 } } item container direction='row' spacing={ 1 } xs={ 12 }>
                  <Grid item container direction='row' spacing={ 1 } xs={ 10 }>
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
                  <Grid item container xs alignContent='center' justify='flex-end'>
                    <IconButton onClick={ () => removeMedicine(index) }>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={ cancel } color="primary">
            Cancel
          </Button>
          <Button onClick={ addMedicine } color="primary">
            <AddIcon />
            Add Medicine
          </Button>
          <Button onClick={ addMedicationRecord } color="primary">
            Add Medication Record
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withResubAutoSubscriptions(PrescriptionPage)