import React, { FC, useState, useEffect } from 'react'
import {
  TextField, InputAdornment, Typography, CircularProgress,
  Card, CardContent, Grid, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Button, ButtonBase,
  useMediaQuery, useTheme, Checkbox, FormControl, FormControlLabel, FormHelperText
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'
import { Search as SearchIcon } from '@material-ui/icons'

import { AppContainer } from '../common'
import { maleAvatar, femaleAvatar } from '../../resources/images'
import { UserStore, Patient, HealthRecordStore, AccessPermissionStore } from '../../stores'

interface PageProp {

}

const PatientPage: FC<PageProp> = () => {
  const theme = useTheme()
  const history = useHistory()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const patients = UserStore.getPatients()
  const isReady = UserStore.ready()
  const isWaiting = AccessPermissionStore.getIsWaiting()
  const respond = AccessPermissionStore.getRespond()

  const [ selectedPatient, setSelectedPatient ] = useState<Patient>()
  const [ filter, setFilter ] = useState('')
  const [ open, setOpen ] = useState(false)
  const [ isSending, setIsSending ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ accessError, setAccessError ] = useState('')

  useEffect(() => {
    if (isReady && isLoading) {
      UserStore.fetchAllPatients()
        .finally(() => setIsLoading(false))
    }

    return UserStore.unsubscribe
  }, [ isReady, isLoading ])

  useEffect(() => {
    if (selectedPatient && !isWaiting) {
      if (respond === 'accepted') {
        Promise.resolve(
          HealthRecordStore.setSelectedPatient(selectedPatient)
        ).then(() => {
          AccessPermissionStore.setRespond()
          setOpen(false)
          history.push('/patient/detail')
        })
      } else if (respond === 'rejected') {
        setAccessError('Your requested is rejected.')
        setIsSending(false)
      }
    }
  }, [ history, selectedPatient, isWaiting, respond ])

  useEffect(() => {
    if (!isWaiting && !respond) {
      setIsSending(false)
    }
  }, [ isWaiting, respond ])

  return (
    <AppContainer isLoading={ isLoading }>
      <Typography variant='h2' gutterBottom>{ 'Patient' }</Typography>
      {/* Search Bar */ }
      <TextField
        label='Search'
        placeholder="Please enter the patient's name"
        InputProps={ {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        } }
        onChange={ event => setFilter(event.target.value) }
        variant='outlined'
        fullWidth
      />
      {/* Patient Box */ }
      { PatientList(patients.filter(u => u.username.includes(filter))) }
      { AccessRequestDialog() }
    </AppContainer>
  )

  function PatientList(patients: Patient[]) {
    return (
      <Grid container direction='row' spacing={ 3 } style={ { marginTop: 10 } }>
        { patients.map(PatientBox) }
      </Grid>
    )
  }

  function PatientBox(patient: Patient, index: number) {
    const { username, dob, gender } = patient

    const age = (birthdate: Date) => {
      return new Date().getUTCFullYear() - birthdate.getUTCFullYear()
    }

    const onClick = () => {
      setOpen(true)
      setSelectedPatient(patient)
    }

    return (
      <Grid key={ 'patient-' + index } item xs={ 6 } sm={ 4 } md={ 3 } lg={ 2 }>
        <ButtonBase onClick={ onClick }>
          <Card>
            <img style={ { margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%' } } alt='num' src={ gender === 'F' ? femaleAvatar : maleAvatar } />
            <CardContent>
              <Grid container direction='column' alignItems='center' spacing={ 1 }>
                <Grid item xs={ 12 }>{ username }</Grid>
                <Grid item xs={ 12 }>
                  { age(dob) } | { gender }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid>
    )
  }

  function AccessRequestDialog() {
    const [ emergency, setEmergency ] = useState(false)

    const requestAuthentication = () => {
      if (selectedPatient) {
        setIsSending(true)
        Promise.all([
          AccessPermissionStore.setRespond(),
          AccessPermissionStore.requestAccess(selectedPatient.id, emergency, selectedPatient.authorizedUsers)
        ]).catch(err => {
          if (err.message.includes('did not set his/her authorized user')) {
            setAccessError('No authorized user to permit the access.')
          } else {
            console.log(err)
          }
          setIsSending(false)
        })
      }
    }

    return <Dialog open={ open } onClose={ () => isWaiting === false ? setOpen(false) : null } fullScreen={ fullScreen }>
      <DialogTitle>{ 'Attention' }</DialogTitle>
      <DialogContent>
        {
          isWaiting
            ? <Grid container direction='column' justify='center' alignItems='center' style={ { height: '25vh', width: '40vw' } }>
              <CircularProgress size={ 50 } />
            </Grid>
            : <>
              <DialogContentText>
                { "To provide the patient's data from leakage, authentication is necessary from the patient. If you are confirmed to view this patient's data, click \"request\" to proceed. If the patient is under comma, please check the \"emergency\" option." }
              </DialogContentText>
              { accessError !== ''
                ? <FormHelperText error>{ accessError }</FormHelperText>
                : null
              }
              <FormControl>
                <FormControlLabel
                  label='Emergency'
                  control={
                    <Checkbox
                      checked={ emergency }
                      color='primary'
                      onChange={ event => setEmergency(event.target.checked) }
                    />
                  }
                />
              </FormControl>
            </>
        }
      </DialogContent>
      <DialogActions>
        <Button disabled={ isSending } onClick={ () => setOpen(false) } color="primary">
          Cancel
      </Button>
        <Button disabled={ isSending } onClick={ requestAuthentication } color="primary">
          Request
      </Button>
      </DialogActions>
    </Dialog>
  }
}

export default withResubAutoSubscriptions(PatientPage)