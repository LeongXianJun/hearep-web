import React, { FC, useState, useEffect } from 'react'
import { AppContainer } from '../common'
import {
  Grid, Card, CardHeader, CardContent,
  CardActions, Breadcrumbs, Typography, Link, Button,
  TextField, FormHelperText
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'
import { Update as UpdateIcon } from '@material-ui/icons'

import { UserStore, HealthRecordStore } from '../../stores'

interface PageProp {

}

const AddPrescriptionPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const record = HealthRecordStore.getSelectedHPRecord()
  const patient = HealthRecordStore.getSelectedPatient()
  const date = new Date()

  const [ prescriptionInfo, setPI ] = useState({
    illness: '',
    clinicalOpinion: ''
  })
  const [ piErrors, setPIErrors ] = useState({
    illness: '',
    clinicalOpinion: ''
  })

  const updatePI = (field: 'illness' | 'clinicalOpinion', value: string) => {
    setPI({ ...prescriptionInfo, [ field ]: value })
    if (piErrors[ field ] !== '')
      setPIErrors({ ...piErrors, [ field ]: '' })
  }

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ isReady, patient, history ])

  useEffect(() => {
    if (record) {
      setPI({ illness: record.illness, clinicalOpinion: record.clinicalOpinion })
    }
  }, [ record ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username },
    { path: '/prescription', text: 'Health Prescription on ' + record?.date.toDateString() },
    { path: undefined, text: 'Update Health Prescription' }
  ]

  const submit = () => {
    if (record) {
      const { illness, clinicalOpinion } = prescriptionInfo
      HealthRecordStore.updateHealthRecord({
        type: 'Health Prescription', id: record.id, patientId: record.patientId,
        illness, clinicalOpinion
      }).then(() => {
        history.goBack()
      }).catch(err => {
        console.log(err)
        const errors: string[] = err.message.split('"healthRecord.')
        setPIErrors(
          errors.reduce<{
            illness: string,
            clinicalOpinion: string
          }>((all, e) => {
            if (e.includes('illness')) {
              return { ...all, 'illness': e.replace('"', '') }
            } else if (e.includes('clinicalOpinion')) {
              return { ...all, 'clinicalOpinion': e.replace('"', '') }
            } else
              return all
          }, {
            illness: '',
            clinicalOpinion: ''
          })
        )
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
        <Grid item xs={ 12 }>
          { PrescriptionDetail() }
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
                value={ prescriptionInfo.illness }
                error={ piErrors.illness !== '' }
                onChange={ event => updatePI('illness', event.target.value) }
              />
              { piErrors.illness !== ''
                ? <FormHelperText error>{ piErrors.illness }</FormHelperText>
                : null
              }
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
                value={ prescriptionInfo.clinicalOpinion }
                error={ piErrors.clinicalOpinion !== '' }
                onChange={ event => updatePI('clinicalOpinion', event.target.value) }
              />
              { piErrors.clinicalOpinion !== ''
                ? <FormHelperText error>{ piErrors.clinicalOpinion }</FormHelperText>
                : null
              }
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={ submit } startIcon={ <UpdateIcon /> } color="primary" size='small'>
            Update Health Prescription
            </Button>
        </CardActions>
      </Card>
    )
  }
}

export default withResubAutoSubscriptions(AddPrescriptionPage)