import React, { useState } from 'react'
import { AppContainer } from '../common'
import { makeStyles, Theme, createStyles, TextField, InputAdornment,
  Card, CardContent, Grid, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button, ButtonBase, 
  useMediaQuery, useTheme, Checkbox, FormControl, FormControlLabel } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import UC, { User } from '../../connections/UserConnection'

import maleAvatar from '../../resources/images/maleAvatar.png'
import femaleAvatar from '../../resources/images/femaleAvatar.png'
import { useHistory } from 'react-router-dom'

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

export default function PatientPage() {
  const theme = useTheme()
  const styles = useStyles()
  const history = useHistory()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [ filter, setFilter ] = useState('')
  const [ open, setOpen ] = useState(false)
  const [ emergency, setEmergency ] = useState(false)

  const requestAuthentication = () => {
    setOpen(false)
    history.push('/patient/detail')
  }

  return(
    <AppContainer>
      {/* Search Bar */}
      <TextField
        // className={classes.margin}
        label='Search'
        placeholder="Please enter the patient's name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={event => setFilter(event.target.value)}
        variant='outlined'
        fullWidth
      />
      {/* Patient Box */}
      { PatientList(UC.mockUserDB.filter(u => u.type === 'patient' && u.username.includes(filter))) }
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen}>
        <DialogTitle>Attention</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"To provide the patient's data from leakage, authentication is necessary from the patient. If you are confirmed to view this patient's data, click \"request\" to proceed. If the patient is under comma, please check the \"emergency\" option."}
          </DialogContentText>
          <FormControl>
            <FormControlLabel
              label='Emergency'
              control={
                <Checkbox
                  checked={emergency}
                  color='primary'
                  onChange={event => setEmergency(event.target.checked)}
                />
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={requestAuthentication} color="primary">
            Request
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  )

  function PatientList(patients: User[]) {
    return (
      <Grid container direction='row' spacing={3} style={{marginTop: 10}}>
        { patients.map(PatientBox) }
      </Grid>
    )
  }
  
  function PatientBox(patient: User) {
    const {detail} = patient
  
    const onClick = () => {
      setOpen(true)
      UC.selectedPatient = patient
    }

    return (
      <Grid key={patient.username} item xs={6} sm={4} md={3} lg={2}>
        <ButtonBase onClick={onClick}>
          <Card>
            <img style={{ margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%' }} alt='num' src={detail?.gender === 'F'? femaleAvatar: maleAvatar}/>
            <CardContent>
              <Grid container direction='column' alignItems='center' spacing={1}>
                <Grid item xs={12}>{detail?.fullname}</Grid>
                <Grid item xs={12}>
                  {detail?.age} | {detail?.gender}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid>
    )
  }
}