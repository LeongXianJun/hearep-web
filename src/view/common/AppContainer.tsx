import React from 'react'
import NavBar from './NavBar'
import { Box, Container} from '@material-ui/core'

export default function AppContainer(prop: ACProps) {
  const { children } = prop

  return(
    <>
      <NavBar/>
      <Box style={{ height: '100vh', width: '100vw' }}>
        <Container style={{ height: '100%', paddingTop: '80px' }}>
          { children }
        </Container>
      </Box>
    </>
  )
}

interface ACProps {
  children: JSX.Element[] | JSX.Element
}