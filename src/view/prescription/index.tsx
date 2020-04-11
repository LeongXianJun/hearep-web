import React, { useState } from 'react'
import { AppContainer, AppExpansion } from '../common'
import { Grid, useMediaQuery, Divider, IconButton,
  useTheme, Table, TableBody, TableRow, TableCell, 
  Card, CardHeader, CardContent, TableHead, Breadcrumbs, 
  Typography, Link, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import AC from '../../connections/AppointmentConnection'
import RC, { Record } from '../../connections/RecordConnection'

export default function PatientPage() {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const record = RC.selectedRecord
  const [ open, setOpen ] = useState(false)

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: record.name },
    { path: '/prescription', text: 'Health Prescription on ' + record.date.toDateString() }
  ]

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
          <AppExpansion
            title='Prescription Information'
            defaultExpanded
          >
            { pescriptionInfo(record) }
          </AppExpansion>
          {
            record.type === 'health prescription' && record.appID !== undefined
            ? appointmentDetail(record.appID)
            : undefined
          }
        </Grid>
        <Grid item xs={12} md={6}>
          <AppExpansion
            title='Medication Records'
            defaultExpanded
            actions={<Button size="small" onClick={() => setOpen(true)}>Add</Button>}
          >
            <Grid container direction='column' spacing={1}>
              { 
                RC.recordDB.filter(r => r.type === 'medication record' && r.prescriptionID === record.id)
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map(medicationRecord)
              }
            </Grid>
          </AppExpansion>
        </Grid>
      </Grid>
      { AddMedicationRecordDialog() }
    </AppContainer>
  )

  function pescriptionInfo(record: Record) {
    const details = [
      { field: 'Patient Name', val: record.name },
      { field: 'Consultation Date', val: record.date.toDateString() },
      { field: 'Illness', val: record.type === 'health prescription'? record.illness: undefined },
      { field: 'Clinical Opinion', val: record.type === 'health prescription'? record.clinicalOpinion: undefined },
    ].filter(({val}) => val !== undefined && val !== '')
  
    return (
      <Table>
        <TableBody>
          {
            details.map(({field, val}, index) => 
              <TableRow hover key={'drow-' + index}>
                <TableCell>{field}</TableCell>
                <TableCell>{val}</TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    )
  }

  function appointmentDetail(appID: number) {
    const appointment = AC.appointmentDB.find(a => a.id === appID)
    const details = [
      { field: 'Date', val: appointment?.date.toDateString() },
      { field: 'Time', val: appointment?.type === 'byTime'? appointment.time: undefined }
    ].filter(({val}) => val !== undefined && val !== '')

    return (
      <Card>
        <CardHeader title={'Appointment Detail'}/>
        <CardContent>
          <Table>
            <TableBody>
              {
                details.map(({field, val}, index) => 
                  <TableRow hover key={'arow-' + index}>
                    <TableCell>{field}</TableCell>
                    <TableCell>{val}</TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  function medicationRecord(record: Record, index: number) {
    return (
      <Grid key={'md-' + index} item xs={12}>
        <AppExpansion
          title={'Medication Record on ' + record.date.toDateString()}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{'Medicine'}</TableCell>
                <TableCell>{'Dosage'}</TableCell>
                <TableCell>{'Usage'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                record.type === 'medication record'
                ? record.medications.map(({medicine, dosage, usage}, rowIndex) => 
                    <TableRow hover key={'mrrow-' + rowIndex}>
                      <TableCell>{medicine}</TableCell>
                      <TableCell>{dosage}</TableCell>
                      <TableCell>{usage}</TableCell>
                    </TableRow>
                  )
                : undefined
              }
            </TableBody>
          </Table>
        </AppExpansion>
      </Grid>
    )
  }

  function AddMedicationRecordDialog() {
    const [medicines, setMedicines] = useState([{ medicine: '', dosage: 0, usage: '' }])
    const addMedicine = () => {
      setMedicines([...medicines, { medicine: '', dosage: 0, usage: '' }])
    }

    const removeMedicine = (num: number) => {
      setMedicines([...medicines.slice(0, num), ...medicines.slice(num + 1)])
    }

    const updateMedicine = (num: number, val: string) => {
      setMedicines([...medicines.slice(0, num), { ...medicines[num], 'medicine': val }, ...medicines.slice(num + 1) ])
    }

    const updateDosage = (num: number, val: number) => {
      setMedicines([...medicines.slice(0, num), { ...medicines[num], 'dosage': val }, ...medicines.slice(num + 1) ])
    }

    const updateUsage = (num: number, val: string) => {
      setMedicines([...medicines.slice(0, num), { ...medicines[num], 'usage': val }, ...medicines.slice(num + 1) ])
    }

    const addMedicationRecord = () => {
      RC.addNewMedicationRecord(medicines)
      setOpen(false)
    }
  
    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen} maxWidth='md'>
        <DialogTitle>{'New Medication Record'}</DialogTitle>
        <DialogContent>
          <Grid container direction='column'>
            {
              medicines.map((medicine, index) => 
                <Grid key={'medicine-' + index} style={{marginBottom: 5}} item container direction='row' spacing={1} xs={12}>
                  <Grid item container direction='row' spacing={1} xs={10}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Medicine"
                        fullWidth
                        label={"Medicine " + (index + 1)}
                        onChange = {event => updateMedicine(index, event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField
                        required
                        variant="outlined"
                        type="number"
                        placeholder="Enter the Dosage"
                        fullWidth
                        label={"Dosage " + (index + 1)}
                        onChange = {event => updateDosage(index, Number(event.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Usage"
                        fullWidth
                        label={"Usage " + (index + 1)}
                        onChange = {event => updateUsage(index, event.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs alignContent='center' justify='flex-end'>
                    <IconButton onClick={() => removeMedicine(index)}>
                      <DeleteIcon/>
                    </IconButton>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </DialogContent>
        <Divider/>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addMedicine} color="primary">
            <AddIcon/>
            Add Medicine
          </Button>
          <Button onClick={addMedicationRecord} color="primary">
            Add Medication Record
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}