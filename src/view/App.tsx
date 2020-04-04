import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'

// pages
const AuthorizationPage = loadable(() => import('./authorization/index'))

const routes: RoutePair[] = [
  {
    path: '/',
    page: <AuthorizationPage/>
  }
]

export default class App extends Component<AppProps, AppStates> {
  renderRoute = (): JSX.Element[] => 
     routes.map(({path, page}, index) => (
      <Route key={'r-' + index} path = {path}>
        {page}
      </Route>
    ))

  render() {
    return(
      <Switch>
        { this.renderRoute() }
      </Switch>
    );
  }
}

interface AppProps {}

interface AppStates {}

interface RoutePair {
  path: string
  page: JSX.Element
}

