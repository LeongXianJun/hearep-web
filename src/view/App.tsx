import React, { useEffect } from 'react'
import { Switch, Route, useHistory, Redirect } from 'react-router-dom'
import loadable from '@loadable/component'
import UserConnection from '../connections/UserConnection'

// pages
const Dashboard = loadable(() => import('./Dashboard'))
const MissingPage = loadable(() => import('./MissingPage'))
const AuthorizationPage = loadable(() => import('./authorization/index'))
const UpdateProfileDetailPage = loadable(() => import('./profile/update'))

const routes: RoutePair[] = [
  {
    path: '/login',
    isAuthenticationPage: true,
    page: <AuthorizationPage/>
  },
  {
    path: '/profile/update',
    page: <UpdateProfileDetailPage/>
  },
  {
    path: '/dashboard',
    page: <Dashboard/>
    // will be dashboard
  },
  {
    path: '/',
    page: <MissingPage/>
    // will be dashboard
  }
]

export default function App() {
  const renderRoute = (): JSX.Element[] => 
     routes.map(({path, isAuthenticationPage, page}, index) => (
      <Route key={'r-' + index} path={path}>
        {/* {UserConnection.isLogin() === false
          ? isAuthenticationPage
            ? page
            : <Redirect to='/login'/>
          : isAuthenticationPage // if login, then the user should not able to access authentication pages
            ? <Redirect to='/'/>
            : page
        } */}
        {page}
      </Route>
    ))
    
  // const history = useHistory()
  // useEffect(() => {
  //   if(UserConnection.isLogin() === false) {
  //     history.replace('/login')
  //   }
  // }, [history])

  return(
    <Switch>
      { renderRoute() }
    </Switch>
  );
}

interface RoutePair {
  path: string
  isAuthenticationPage?: boolean
  page: JSX.Element
}

