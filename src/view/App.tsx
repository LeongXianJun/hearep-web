import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'

// pages
const AuthLoadingScreen = loadable(() => import('./authLoading'))
const AuthorizationPage = loadable(() => import('./authorization/index'))
const RegisterInfoPage = loadable(() => import('./authorization/register'))
const AppointmentHistoryPage = loadable(() => import('./appointment/history'))
const AppointmentPage = loadable(() => import('./appointment/index'))
const Dashboard = loadable(() => import('./Dashboard'))
const AddLabTestPage = loadable(() => import('./labTest/add'))
const UpdateLabTestPage = loadable(() => import('./labTest/update'))
const LabTestPage = loadable(() => import('./labTest/index'))
const PatientDetailPage = loadable(() => import('./patient/detail'))
const PatientPage = loadable(() => import('./patient/index'))
const AddPrescriptionPage = loadable(() => import('./prescription/add'))
const UpdatePrescriptionPage = loadable(() => import('./prescription/update'))
const PrescriptionPage = loadable(() => import('./prescription/index'))
const ProfilePage = loadable(() => import('./profile/index'))
const MissingPage = loadable(() => import('./MissingPage'))

const routes: RoutePair[] = [
  { path: '/login', page: <AuthorizationPage /> },
  { path: '/register', page: <RegisterInfoPage /> },
  { path: '/appointment/history', page: <AppointmentHistoryPage /> },
  { path: '/appointment', page: <AppointmentPage /> },
  { path: '/dashboard', page: <Dashboard /> },
  { path: '/labTest/update', page: <UpdateLabTestPage /> },
  { path: '/labTest/add', page: <AddLabTestPage /> },
  { path: '/labTest', page: <LabTestPage /> },
  { path: '/patient/detail', page: <PatientDetailPage /> },
  { path: '/patient', page: <PatientPage /> },
  { path: '/prescription/update', page: <UpdatePrescriptionPage /> },
  { path: '/prescription/add', page: <AddPrescriptionPage /> },
  { path: '/prescription', page: <PrescriptionPage /> },
  { path: '/profile', page: <ProfilePage /> },
  { path: '/:path', page: <MissingPage /> },
  { path: '/', page: <AuthLoadingScreen /> }
]

interface RoutePair {
  path: string
  page: JSX.Element
}

interface AppProp {

}

const App: FC<AppProp> = () => {
  const renderRoute = (): JSX.Element[] =>
    routes.map(({ path, page }, index) => (
      <Route key={ 'r-' + index } path={ path }>
        { page }
      </Route>
    ))

  return (
    <Switch>
      { renderRoute() }
    </Switch>
  )
}

export default App