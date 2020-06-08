import React, { FC, useEffect } from 'react'
import { withResubAutoSubscriptions } from 'resub'
import {
  Container, Grid, CircularProgress
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import { UserStore } from '../stores'
import { icon } from '../resources/logo'

interface PageProp {

}

const AuthLoadingScreen: FC<PageProp> = () => {
  const isReady = UserStore.ready()
  const history = useHistory()

  useEffect(() => {
    if (isReady) {
      history.replace(
        UserStore.getUser() ? 'dashboard' : 'login'
      )
    }

    return UserStore.unsubscribe
  }, [ isReady ])

  return (
    <React.Fragment>
      <div style={ { backgroundColor: '#282c34' } }>
        <Container style={ { height: '100vh' } }>
          <Grid container direction='column' justify='center' alignItems='center' style={ { height: '100vh' } }>
            <img src={ icon } width={ 150 } height={ 130 } alt='logo' />
            <CircularProgress size={ 50 } style={ { marginTop: 25 } } />
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(AuthLoadingScreen)