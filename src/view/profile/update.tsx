import React, { FC, useEffect, useState } from 'react'
import {
  Typography, Grid, DialogTitle, TextField, makeStyles,
  Theme, createStyles, Button, RadioGroup, FormControlLabel,
  Radio, FormControl, InputLabel, Select, MenuItem,
  DialogContent, Dialog, DialogActions, useTheme, useMediaQuery, FormHelperText
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
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

  const [ info, setInfo ] = useState({
    username: '',
    dob: new Date(),
    gender: 'M' as 'M' | 'F',
    medicalInstituition: {
      role: '',
      name: '',
      address: '',
      department: '',
    }
  })
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ err, setErr ] = useState({
    'username': '',
    'name': '',
    'address': '',
    'department': ''
  })

  const updateInfo = (field: 'username' | 'name' | 'address' | 'department', value: string) => {
    if (field !== 'username') {
      setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, [ field ]: value } })
    } else {
      setInfo({ ...info, [ field ]: value })
    }
    setErr({ ...err, [ field ]: '' })
  }

  useEffect(() => {
    if (CurrentUser) {
      setInfo({ ...CurrentUser })
    }

    return UserStore.unsubscribe
  }, [ CurrentUser ])

  const { username, dob, gender, medicalInstituition: { role, name, address, department } } = info

  const submit = () =>
    UserStore.updateProfile({ username, dob, gender, medicalInstituition: { name, role, address, department } })
      .then(() => onClose())
      .catch(err => {
        const errors: string[] = err.message.split('"user.')
        setErr(
          errors.reduce<{
            'username': string
            'name': string
            'address': string
            'department': string
          }>((all, e) => {
            if (e.includes('username')) {
              return { ...all, 'username': e.replace('"', '') }
            } else if (e.includes('medicalInstituition.name')) {
              return { ...all, 'name': e.replace('"', '') }
            } else if (e.includes('medicalInstituition.address')) {
              return { ...all, 'address': e.replace('"', '') }
            } else if (e.includes('medicalInstituition.department')) {
              return { ...all, 'department': e.replace('"', '') }
            } else
              return all
          }, {
            'username': '',
            'name': '',
            'address': '',
            'department': ''
          })
        )
      })
      .finally(() => {
        setIsSubmitting(false)
      })

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
                error={ err[ 'username' ] !== '' }
                value={ username }
                onChange={ event => updateInfo('username', event.target.value) }
              />
              { err[ 'username' ] !== ''
                ? <FormHelperText error>{ err[ 'username' ] }</FormHelperText>
                : null
              }
              <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label='Birth Date'
                  value={ dob }
                  fullWidth
                  onChange={ date => date && setInfo({ ...info, dob: date }) }
                  KeyboardButtonProps={ {
                    'aria-label': 'change date',
                  } }
                />
              </MuiPickersUtilsProvider>
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
                error={ err[ 'name' ] !== '' }
                onChange={ event => updateInfo('name', event.target.value) }
              />
              { err[ 'name' ] !== ''
                ? <FormHelperText error>{ err[ 'name' ] }</FormHelperText>
                : null
              }
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
                error={ err[ 'address' ] !== '' }
                onChange={ event => updateInfo('address', event.target.value) }
              />
              { err[ 'address' ] !== ''
                ? <FormHelperText error>{ err[ 'address' ] }</FormHelperText>
                : null
              }
              <TextField
                variant="outlined"
                className={ styles.input }
                placeholder="Enter your Department"
                label="Department"
                fullWidth
                value={ department }
                error={ err[ 'department' ] !== '' }
                onChange={ event => updateInfo('department', event.target.value) }
              />
              { err[ 'department' ] !== ''
                ? <FormHelperText error>{ err[ 'department' ] }</FormHelperText>
                : null
              }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={ () => onClose() }>Close</Button>
          <Button variant='contained' disabled={ isSubmitting } onClick={ submit } color='primary'>Update Info</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(ProfileUpdatePage)