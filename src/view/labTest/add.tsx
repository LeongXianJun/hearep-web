import React, { useState } from 'react'
import { AppContainer } from '../common'
import { Grid, IconButton,
  Card, CardHeader, CardContent, CardActions, Breadcrumbs, 
  Typography, Link, Button, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import UC from '../../connections/UserConnection'
import RC from '../../connections/RecordConnection'
import { useHistory } from 'react-router-dom'

export default function AddLabTestPage() {
  const history = useHistory()
  const patientName = UC.selectedPatient?.detail?.fullname ?? ''
  const date = new Date()
  const [illness, setIllness] = useState('')
  const [clinicalOponion, setClinicalOponion] = useState('')
  const [medicines, setMedicines] = useState([{ medicine: '', dosage: 0, usage: '' }])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patientName },
    { path: undefined, text: 'Add new Health Prescription'}
  ]

  const submit = () => {
    RC.addNewHealthPrescription(patientName, illness, clinicalOponion, medicines)
    history.goBack()
  }

  return(
    <AppContainer>
      <Breadcrumbs maxItems={3} aria-label="breadcrumb">
        {
          breadcrumbs.map(({path, text}, index, arr) => (
            index === arr.length - 1 || path === undefined
            ? <Typography key={'l-' + index} color="textPrimary">{text}</Typography>
            : <Link key={'l-' + index} color="inherit" href={path}>
                {text}
              </Link>
          ))
        }        
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={3} style={{marginTop: 5}}>
        <Grid item xs={12} md={4}>
          { prescriptionDetail() }
        </Grid>
        <Grid item xs={12} md={8}>
          {Medication()}
        </Grid>
      </Grid>
    </AppContainer>
  )

  function prescriptionDetail() {
    return (
      <Card>
        <CardHeader title={'Prescription Information'}/>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                disabled
                value={patientName}
                label="Patient"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                disabled
                value={date.toDateString()}
                label="Date"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                variant='outlined'
                placeholder="Enter the main illness"
                label="Illness"
                fullWidth
                onChange = {event => setIllness(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                variant='outlined'
                placeholder="Enter your opinion on the illness"
                label="Clinical Opinion"
                fullWidth
                multiline
                rows={3}
                rowsMax={5}
                onChange = {event => setClinicalOponion(event.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={submit} color="primary" size='small'>
            Add new Health Prescription
          </Button>
        </CardActions>
      </Card>
    )
  }

  function Medication() {
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

    return (
      <Card>
        <CardHeader 
          title={'Medication Record'}
          action={
            <IconButton  onClick={addMedicine}>
              <AddIcon/>
            </IconButton>
          }
        />
        <CardContent>
          <Grid container direction='column' spacing={2}>
            {
              medicines.map((medicine, index) => 
                <Grid key={'medicine-' + index} item container direction='row' spacing={1} xs={12}>
                  <Grid item container direction='row' spacing={1} xs={10} sm={11}>
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
                  <Grid item container xs alignContent='center' justify='center'>
                    <IconButton onClick={() => removeMedicine(index)}>
                      <DeleteIcon/>
                    </IconButton>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </CardContent>
      </Card>
    )
  }
}