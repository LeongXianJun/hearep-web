import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import firebase from 'firebase'
import loadable from '@loadable/component'

import './index.css'
import * as serviceWorker from './serviceWorker'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_ApiKey,
  appId: process.env.REACT_APP_AppId,
  authDomain: process.env.REACT_APP_AuthDomain,
  databaseURL: process.env.REACT_APP_DatabaseURL,
  projectId: process.env.REACT_APP_ProjectId,
  storageBucket: process.env.REACT_APP_StorageBucket,
  messagingSenderId: process.env.REACT_APP_MessagingSenderId
})

const App = loadable(() => import('./view/App'))
const NotificationManager = loadable(() => import('./view/NotificationManager'))

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <NotificationManager>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationManager>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
