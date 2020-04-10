import React from 'react'
import { Box, Grid, Typography, makeStyles, Theme, createStyles, Container } from '@material-ui/core'
import { NavLink } from 'react-router-dom'

// image
import icon from '../resources/logo/icon.svg'
import title from '../resources/logo/title.svg'
import slogan from '../resources/logo/slogan.svg'

//  style
import './App.css'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      color: '#e2e2e2'
    },
  }),
);

export default function MissingPage () {
  const styles = useStyles()

  return(
    <Box style={{ backgroundColor: '#282c34', height: '100vh', width: '100vw' }}>
      <Container>
        <Grid container direction='row' justify='center' alignItems='center' style={{ height: '100vh' }}>
          <Grid item container direction='column' alignItems='center' spacing={1} xs={12} sm={6}>
            <Grid item>
              <img src={icon} className='App-icon' alt='logo' />
            </Grid>
            <Grid item>
              <img src={title} className='App-title' alt='logo' />
            </Grid>
            <Grid item>
              <img src={slogan} className='App-slogan' alt='logo' />
            </Grid>
          </Grid>
          <Grid item container spacing={3} xs={12} sm={6}>
            <Grid item>
              <Typography variant='h3' className={styles.text}>{'Sorry, this content is not available right now.'}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='subtitle1' className={styles.text}>{'This link you followed may be expired, or the page may still under development. Please try another URL.'}</Typography>
            </Grid>
            <Grid item>
              <NavLink to='/dashboard' className={styles.text}>{'Back to Home'}</NavLink>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
