import React, { FC, useState } from 'react'
import {
  Container, TextField, Button, Grid, Typography,
  FormControl, RadioGroup, FormControlLabel, Radio, InputLabel,
  Select, MenuItem, makeStyles, Theme, createStyles
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import './index.css'
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

}

const RegisterInfoPage: FC<PageProp> = () => {
  const styles = useStyle()
  const history = useHistory()

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
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const { gender, medicalInstituition: { role } } = info

  const submit = () => {
    setIsSubmitting(true)
    UserStore.createUser({ ...info })
      .then(() => {
        setIsSubmitting(false)
        UserStore.setRegister(false)
        history.replace('dashboard')
      })
      .catch(err => console.error((err)))
  }

  return (
    <React.Fragment>
      <Container style={ { height: '100vh' } }>
        <Grid container direction='column' justify='center' alignItems='center' style={ { height: '100vh' } }>
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
                onChange={ event => setInfo({ ...info, username: event.target.value }) }
              />
              <TextField
                required
                variant="outlined"
                className={ styles.input }
                placeholder="1999-01-16"
                label="Birth Date"
                fullWidth
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
                onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, name: event.target.value } }) }
              />
              <FormControl variant="outlined" fullWidth className={ styles.input }>
                <InputLabel>{ 'Role' }</InputLabel>
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
                onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, address: event.target.value } }) }
              />
              <TextField
                variant="outlined"
                className={ styles.input }
                placeholder="Enter your Department"
                label="Department"
                fullWidth
                onChange={ event => setInfo({ ...info, medicalInstituition: { ...info.medicalInstituition, department: event.target.value } }) }
              />
            </Grid>
          </Grid>
          <Grid item style={ { marginTop: 10, marginBottom: 10 } }>
            <Button variant='contained' onClick={ submit } disabled={ isSubmitting } color='primary'>{ 'Create Account' }</Button>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default RegisterInfoPage