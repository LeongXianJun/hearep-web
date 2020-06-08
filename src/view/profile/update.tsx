import React, { FC, useEffect, useState } from 'react'
import {
  Typography, Grid, DialogTitle, TextField, makeStyles,
  Theme, createStyles, Button, RadioGroup, FormControlLabel,
  Radio, FormControl, InputLabel, Select, MenuItem,
  DialogContent, Dialog, DialogActions, useTheme, useMediaQuery
} from '@material-ui/core'
import { withResubAutoSubscriptions } from 'resub'

import { UserStore } from '../../stores'

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
      textAlign: 'center'
    },
    input: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  })
)

const roles = [
  { val: 'doctor', text: 'Doctor' },
  { val: 'nurse', text: 'Nurse' },
  { val: 'professional', text: 'Allied Health Professional' },
  { val: 'staff', text: 'Support Staff' }
]

interface PageProp {
  open: boolean
  onClose: Function
}

const ProfileUpdatePage: FC<PageProp> = ({ open, onClose }) => {
  const theme = useTheme()
  const styles = useStyle()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const CurrentUser = UserStore.getUser()

  useEffect(() => {
    if (CurrentUser) {
      setInfo({ ...CurrentUser, dob: CurrentUser.dob.toDateString() })
    }

    return UserStore.unsubscribe
  }, [ CurrentUser ])

  const [ info, setInfo ] = useState({
    username: '',
    dob: '',
    gender: 'M' as 'M' | 'F',
    medicalInstituition: {
      role: '',
      name: '',
      address: '',
      department: '',
    }
  })

  const { username, dob, gender, medicalInstituition: { role, name, address, department } } = info

  const submit = () =>
    UserStore.updateProfile({ ...CurrentUser, ...info })
      .then(() => onClose())

  return (
    <React.Fragment>
      <Dialog
        open={ open }
        onClose={ () => onClose() }
        onBackdropClick={ () => onClose() }
        fullScreen={ fullScreen }
      >
        <DialogTitle disableTypography>
          <Typography variant='h4' align='left'>{ 'Profile Detail' }</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container direction='row' spacing={ 3 }>
            <Grid item md={ 6 } xs={ 12 }>
              <Typography variant='h5' align='left'>{ 'Basic Information' }</Typography>
              <TextField
                required
                variant="outlined"
                className={ styles.input }
                placeholder="Enter your Fullname"
                label="Fullname"
                fullWidth
                value={ username }
                onChange={ event => setInfo({ ...info, username: event.target.value }) }
              />
              <TextField
                required
                variant="outlined"
                className={ styles.input }
                placeholder="Enter your Birth Date"
                label="Date"
                fullWidth
                value={ dob }
                onChange={ event => setInfo({ ...info, dob: event.target.value }) }
              />
              <FormControl fullWidth className={ styles.input }>
                <Typography variant='subtitle1' align='left'>{ 'Gender' }</Typography>
                <RadioGroup row aria-label="gender" name="gender" value={ gender } onChange={ event => setInfo({ ...info, gender: event.target.value as 'M' | 'F' }) }>
                  <FormControlLabel value="M" control={ <Radio /> } label="Male" />
                  <FormControlLabel value="F" control={ <Radio /> } label="Female" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item md={ 6 } xs={ 12 } container direction='column' spacing={ 1 } alignItems='flex-start'>
              <Typography variant='h5' align='left' noWrap>{ 'Working Information' }</Typography>
              <TextField
                variant="outlined"
                className={ styles.input }
                placeholder="Enter your Medical Institution"
                label="Medical Institution"
                fullWidth
                value={ name }
                onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, name: event.target.value } }) }
              />
              <FormControl variant="outlined" fullWidth className={ styles.input }>
                <InputLabel>Role</InputLabel>
                <Select
                  value={ role }
                  onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, role: event.target.value as string } }) }
                >
                  {
                    roles.map(({ val, text }, index) => <MenuItem key={ 'role-' + index } value={ val }>{ text }</MenuItem>)
                  }
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                className={ styles.input }
                placeholder="Enter the address of the Medical Institution"
                label="Address of Medical Institution"
                fullWidth
                multiline
                rows={ 3 }
                rowsMax={ 3 }
                value={ address }
                onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, address: event.target.value } }) }
              />
              <TextField
                variant="outlined"
                className={ styles.input }
                placeholder="Enter your Department"
                label="Department"
                fullWidth
                value={ department }
                onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, department: event.target.value } }) }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={ () => onClose() }>Close</Button>
          <Button variant='contained' onClick={ submit } color='primary'>Update Info</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(ProfileUpdatePage)