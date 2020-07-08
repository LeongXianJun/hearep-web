import React, { FC, useState } from 'react'
import {
  Box, Container, TextField, Button,
  Grid, Tabs, Tab, useTheme, Paper, FormHelperText
} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import { useHistory } from 'react-router-dom'

import './index.css'
import { AuthUtil } from '../../utils'
import { UserStore } from '../../stores'
import { tabProps, AppTabPanel } from '../common'
import { icon, title, slogan } from '../../resources/logo'

interface PageProp {

}

const AuthorizationPage: FC<PageProp> = () => {
  const theme = useTheme()
  const history = useHistory()

  const [ value, setValue ] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
    UserStore.setRegister(newValue !== 1)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <React.Fragment>
      <div style={ { backgroundColor: '#282c34' } }>
        <Container style={ { height: '100vh' } }>
          <Grid container direction='column' justify='center' alignItems='center' style={ { height: '100vh' } }>
            <Grid container direction='row' spacing={ 3 } justify='center' alignItems='center'>
              <Grid item>
                <img src={ icon } className='App-icon' alt='logo' />
              </Grid>
              <Grid item>
                <Grid container direction='column'>
                  <Box>
                    <img src={ title } className='App-title' alt='logo' />
                  </Box>
                  <Box>
                    <img src={ slogan } className='App-slogan' alt='logo' />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={ { marginTop: '2%' } }>
              <Paper style={ { width: '100%' } }>
                <Tabs
                  value={ value }
                  onChange={ handleChange }
                  indicatorColor="primary"
                  textColor="primary"
                  variant='fullWidth'
                >
                  <Tab label='Login' { ...tabProps(0) } />
                  <Tab label='Register' { ...tabProps(1) } />
                </Tabs>
                <SwipeableViews
                  containerStyle={ { alignContent: 'center' } }
                  axis={ theme.direction === 'rtl' ? 'x-reverse' : 'x' }
                  index={ value }
                  onChangeIndex={ handleChangeIndex }
                >
                  {
                    [ Login(), Register() ].map((ele, index) => (
                      <AppTabPanel key={ 'tp-' + index } value={ value } index={ index } dir={ theme.direction }>
                        { ele }
                      </AppTabPanel>
                    ))
                  }
                </SwipeableViews>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  )

  function Login() {
    const [ info, setInfo ] = useState({
      email: '',
      password: ''
    })
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const [ error, setError ] = useState('')

    const updateInfo = (field: 'email' | 'password', value: string) => {
      setInfo({ ...info, [ field ]: value })
      if (error !== '')
        setError('')
    }

    const submit = () => {
      setIsSubmitting(true)
      AuthUtil.signIn(info.email, info.password)
        .then(() => {
          history.replace('/dashboard')
        })
        .catch(err => {
          setError(err.message)
        })
        .finally(() => setIsSubmitting(false))
    }

    return (
      <Grid container direction='column' spacing={ 1 } justify='center' alignItems='center'>
        <Grid item>
          <TextField
            required
            placeholder="Enter your Email"
            label="Email Address"
            fullWidth
            onChange={ event => updateInfo('email', event.target.value) }
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            required
            placeholder="Enter your Password"
            label="Password"
            fullWidth
            onChange={ event => updateInfo('password', event.target.value) }
          />
        </Grid>
        { error !== ''
          ? <Grid item style={ { width: 200 } }>
            <FormHelperText error>{ error }</FormHelperText>
          </Grid>
          : null
        }
        <Grid item>
          <Button variant='contained' style={ { margin: 15 } } disabled={ isSubmitting } onClick={ submit } color={ 'primary' }>Login</Button>
        </Grid>
      </Grid>
    )
  }

  function Register() {
    const [ info, setInfo ] = useState({
      email: '',
      password: '',
      confirm: ''
    })
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const [ error, setError ] = useState('')

    const updateInfo = (field: 'email' | 'password' | 'confirm', value: string) => {
      setInfo({ ...info, [ field ]: value })
      if (error !== '')
        setError('')
    }

    const { email, password, confirm } = info

    const register = () => new Promise<boolean>((resolve, reject) => {
      // password regex checking
      resolve(password === confirm)
    }).then(async result => {
      if (result) {
        setIsSubmitting(true)
        await AuthUtil.register(email, password)
          .then(() => {
            setIsSubmitting(false)
            history.replace('/register')
          })
          .catch(err => Promise.reject(err))
      } else {
        throw new Error('Password is not matched')
      }
    }).catch(err => {
      setError(err.message)
    }).finally(() => setIsSubmitting(false))

    return (
      <Grid container spacing={ 1 } direction='column' justify='center' alignItems='center'>
        <Grid item>
          <TextField
            required
            placeholder="Enter your Email"
            label="Email Address"
            fullWidth
            onChange={ event => updateInfo('email', event.target.value) }
          />
        </Grid>
        <Grid item>
          <TextField
            required
            type="password"
            placeholder="Enter your Password"
            label="Password"
            fullWidth
            onChange={ event => updateInfo('password', event.target.value) }
          />
        </Grid>
        <Grid item>
          <TextField
            required
            type="password"
            placeholder="Enter your Password again"
            label="Confirm"
            fullWidth
            onChange={ event => updateInfo('confirm', event.target.value) }
          />
        </Grid>
        { error !== ''
          ? <Grid item style={ { width: 200 } }>
            <FormHelperText error>{ error }</FormHelperText>
          </Grid>
          : null
        }
        <Grid item>
          <Button variant='contained' style={ { margin: 15 } } disabled={ isSubmitting } onClick={ register } color={ 'primary' }>{ 'Continue' }</Button>
        </Grid>
      </Grid>
    )
  }
}

export default AuthorizationPage