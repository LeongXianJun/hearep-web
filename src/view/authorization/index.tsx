import React from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Tabs, Tab, useTheme, Paper } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import icon from '../../resources/logo/icon.svg'
import title from '../../resources/logo/title.svg'
import slogan from '../../resources/logo/slogan.svg'
import './index.css'

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

function tabProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function AuthorizationPage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

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
              <Grid item direction='column'>
                <Box>
                  <img src={title} className='App-title' alt='logo' />
                </Box>
                <Box>
                  <img src={slogan} className='App-slogan' alt='logo' />
                </Box>
              </Grid>
            </Grid>
            <Grid item style={{marginTop: '2%'}} xs={6}>
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
                      <TabPanel value={value} index={index} dir={theme.direction}>
                        { ele }
                      </TabPanel>
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
}

function Login() {
  return (
    <Grid container direction='column' spacing={1} justify='center' alignItems='center'>
      <Grid item>
        <TextField
          placeholder="Enter your Username/Email Address"
          label="Username/Email Address"
          fullWidth
          // onChange = {(event,newValue) => this.setState({username:newValue})}
        />
      </Grid>
      <Grid item>
        <TextField
          type="password"
          placeholder="Enter your Password"
          label="Password"
          fullWidth
          // onChange = {(event,newValue) => this.setState({password:newValue})}
        />
      </Grid>
      <Grid item>
        <Button variant='contained' style={{margin: 15}}>Login</Button>
      </Grid>
    </Grid>
  )
}

function Register() {
  return (
    <Grid container spacing={1} direction='row' justify='center' alignItems='center'>
      <Grid container sm={6} direction='column' spacing={1} justify='center' alignItems='center'>
        <Grid item>
          <TextField
            placeholder="Enter your Fullname"
            label="Fullname"
            fullWidth
            // onChange = {(event,newValue) => this.setState({username:newValue})}
          />
        </Grid>
        <Grid item>
          <TextField
            placeholder="Enter your Email Address"
            label="Email Address"
            fullWidth
            // onChange = {(event,newValue) => this.setState({password:newValue})}
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            placeholder="Enter your Password"
            label="Password"
            fullWidth
            // onChange = {(event,newValue) => this.setState({password:newValue})}
          />
        </Grid>
      </Grid>
      <Grid container sm={6} direction='column' spacing={1} justify='center' alignItems='center'>
        <Grid item>
          <TextField
            placeholder="Enter your Fullname"
            label="Fullname"
            fullWidth
            // onChange = {(event,newValue) => this.setState({username:newValue})}
          />
        </Grid>
        <Grid item>
          <TextField
            placeholder="Enter your Email Address"
            label="Email Address"
            fullWidth
            // onChange = {(event,newValue) => this.setState({password:newValue})}
          />
        </Grid>
        {/* add birthday and gender (check back the doc) */}
      </Grid>
      <Grid item>
        <Button variant='contained' style={{margin: 20}}>Register</Button>
      </Grid>
    </Grid>
  )
}