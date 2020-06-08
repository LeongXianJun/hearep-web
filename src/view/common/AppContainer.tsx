import React, { FC, useState, useEffect } from 'react'
import { Box, CircularProgress, Container, Grid } from '@material-ui/core'

import NavBar from './NavBar'

interface ComponentProp {
  children: JSX.Element[] | JSX.Element
  isLoading?: boolean
}

const AppContainer: FC<ComponentProp> = ({ children, isLoading = false }) => {
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    if (isLoading === false) {
      const timeout = setTimeout(() => {
        setLoading(false)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [ isLoading ])

  return (
    <>
      <NavBar />
      <Box style={ { height: '100%', minHeight: '100vh', width: '100%' } }>
        <Container style={ { paddingTop: '80px' } }>
          {
            loading
              ? <Grid container direction='column' justify='center' alignItems='center' style={ { height: '80vh' } }>
                <CircularProgress size={ 50 } />
              </Grid>
              : children
          }
        </Container>
      </Box>
    </>
  )
}
export default AppContainer