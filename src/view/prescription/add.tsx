import React, { FC, useState, useEffect } from 'react'
import {
  Grid, IconButton, Card, CardHeader, CardContent,
  CardActions, Breadcrumbs, Typography, Link, Button,
  TextField
} from '@material-ui/core'
import { Add as AddIcon, Create as CreateIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'

import { AppContainer } from '../common'
import { UserStore, HealthRecordStore } from '../../stores'

interface PageProp {

}

const AddPrescriptionPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const patient = HealthRecordStore.getSelectedPatient()
  const date = new Date()

  const [ illness, setIllness ] = useState('')
  const [ clinicalOpinion, setClinicalOpinion ] = useState('')
  const [ refillDate, setRefillDate ] = useState('')
  const [ medicines, setMedicines ] = useState([ { medicine: '', dosage: 0, usage: '' } ])

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ isReady, patient, ])

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
        date, appId: '123', illness, clinicalOpinion
      }).then(async hr => {
        if (hr) {
          if (hr instanceof Error) {
            console.error(hr)
          } else {
            const validMedicines = medicines.filter(m => m.medicine !== '')
            if (validMedicines.length > 0) {
              await HealthRecordStore.insertHealthRecord({
                type: 'Medication Record', patientId: patient.id, date,
                prescriptionId: hr.hrid, refillDate: new Date(refillDate), medications: validMedicines
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
          { prescriptionDetail() }
        </Grid>
        <Grid item xs={ 12 } md={ 8 }>
          { Medication() }
        </Grid>
      </Grid>
    </AppContainer>
  )

  function prescriptionDetail() {
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
              <TextField
                required
                variant="outlined"
                placeholder="Enter the Date to refill medecine"
                fullWidth
                label={ 'Refill Date' }
                onChange={ event => setRefillDate(event.target.value) }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

export default withResubAutoSubscriptions(AddPrescriptionPage)