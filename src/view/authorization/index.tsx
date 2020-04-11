import React from 'react';
import { Box, Container, Typography, TextField, Button, 
  Grid, Tabs, Tab, useTheme, Paper } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import { useHistory } from 'react-router-dom'
import UC from '../../connections/UserConnection'

import icon from '../../resources/logo/icon.svg'
import title from '../../resources/logo/title.svg'
import slogan from '../../resources/logo/slogan.svg'

import './index.css'
import { tabProps, AppTabPanel } from '../common';

export default function AuthorizationPage() {
  const theme = useTheme()
  const history = useHistory()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }

  const handleChangeIndex = (index: number) => {
    setValue(index);
  }

  return (
    <React.Fragment>
      <div style={{backgroundColor: '#282c34'}}>
        <Container style={{height: '100vh'}}>
          <Grid container direction='column' justify='center' alignItems='center' style={{height: '100vh'}}>
            <Grid container direction='row' spacing={3} justify='center' alignItems='center'>
              <Grid item>
                <img src={icon} className='App-icon' alt='logo' />
              </Grid>
              <Grid item>
                <Grid container direction='column'>
                  <Box>
                    <img src={title} className='App-title' alt='logo' />
                  </Box>
                  <Box>
                    <img src={slogan} className='App-slogan' alt='logo' />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{marginTop: '2%'}}>
              <Paper style={{width: '100%'}}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant='fullWidth'
                >
                  <Tab label='Login' {...tabProps(0)}/>
                  <Tab label='Register' {...tabProps(1)}/>
                </Tabs>
                <SwipeableViews
                  containerStyle={{alignContent: 'center'}}
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  {
                    [Login(), Register()].map((ele, index) => (
                      <AppTabPanel key={'tp-' + index} value={value} index={index} dir={theme.direction}>
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
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [result, setR] = React.useState('')
  
    const submit = () => UC.authenticate(username, password)
      .then(res => setR(res))
      .then(() => history.replace('/dashboard'))
      .catch(err => setR(err.message))
  
    return (
      <Grid container xs={12} direction='column' spacing={1} justify='center' alignItems='center'>
        <Grid item>
          <TextField
            required
            placeholder="Enter your Username/Email"
            label="Username/Email Address"
            fullWidth
            onChange = {event => setUsername(event.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            required
            placeholder="Enter your Password"
            label="Password"
            fullWidth
            onChange = {event => setPassword(event.target.value)}
          />
        </Grid>
        <Grid item>
          <Typography>
            {result}
          </Typography>
          <Button variant='contained' style={{margin: 15}} onClick={submit}>Login</Button>
        </Grid>
      </Grid>
    )
  }

  function Register() {
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirm, setConfirm] = React.useState('')
    const [result, setR] = React.useState('')
  
    const register = () => new Promise<boolean>((resolve, reject) => {
      // password regex checking
      resolve(password === confirm)
    }).then(result => {
      if(result) {
        UC.register(username, email, password)
          .then(res => setR(res))
          .then(() => history.replace('/dashboard'))
          .catch(err => setR(err.message))
      } else {
        throw new Error('Password is not matched')
      }
    })
    .catch(err => setR(err.message))
  
    return (
      <Grid container spacing={1} direction='column' justify='center' alignItems='center'>
        <Grid item>
          <Grid container spacing={1} direction='row' justify='center' alignItems='center'>
            <Grid item>
              <TextField
                required
                placeholder="Enter your Username"
                label="Username"
                fullWidth
                onChange = {event => setUsername(event.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                placeholder="Enter your Email"
                label="Email Address"
                fullWidth
                onChange = {event => setEmail(event.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1} direction='row' justify='center' alignItems='center'>
            <Grid item>
              <TextField
                required
                type="password"
                placeholder="Enter your Password"
                label="Password"
                fullWidth
                onChange = {event => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                type="password"
                placeholder="Enter your Password again"
                label="Confirm"
                fullWidth
                onChange = {event => setConfirm(event.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography>
            {result}
          </Typography>
          <Button variant='contained' style={{margin: 15}} onClick={register}>Register</Button>
        </Grid>
      </Grid>
    )
  }
}