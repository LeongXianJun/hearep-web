import React, { FC, useState, useEffect } from 'react'
import {
  Typography, Grid, Table, TableBody, TableRow,
  TableCell, Fab, useTheme, Avatar
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { withResubAutoSubscriptions } from 'resub'

import AC, { FixedTime } from '../../connections/AppointmentConnection'
import UpdateDialog from './update'
import { UserStore, MedicalStaff } from '../../stores'
import { AppContainer, AppExpansion } from '../common'
import { maleAvatar, femaleAvatar } from '../../resources/images'

interface PageProp {

}

const ProfilePage: FC<PageProp> = () => {
  const theme = useTheme()
  const user = UserStore.getUser()
  const isReady = UserStore.ready()

  const [ open, setOpen ] = useState(false)

  useEffect(() => {
    return UserStore.unsubscribe
  }, [])

  return (
    <AppContainer isLoading={ isReady === false }>
      <Grid container spacing={ 3 } justify='center'>
        <Grid item container direction='column' justify='center' alignContent='center' spacing={ 3 }>
          <Grid item>
            <Avatar style={ { margin: 'auto', display: 'block', width: theme.spacing(20), height: theme.spacing(20) } } alt='num' src={ user?.gender === 'F' ? femaleAvatar : maleAvatar } />
          </Grid>
          <Grid item>
            <Typography variant='h4' align='center'>{ user?.username }</Typography>
          </Grid>
        </Grid>
        <Grid item container direction='row' spacing={ 3 } xs={ 12 } justify='center' alignContent='center' >
          {
            user
              ? <>
                <Grid item container direction='column' xs={ 12 } sm={ 6 } spacing={ 2 }>
                  <Grid item>
                    { BasicInfo(user) }
                  </Grid>
                  <Grid item>
                    { ContactInfo(user) }
                  </Grid>
                </Grid>
                <Grid item container direction='column' xs={ 12 } sm={ 6 } spacing={ 2 }>
                  <Grid item>
                    { WorkingInfo(user) }
                  </Grid>
                  <Grid item>
                    { TimeSlotInfo(user) }
                  </Grid>
                </Grid>
              </>
              : <Typography>{ 'Information Not Found. Please contact the developer.' }</Typography>
          }
        </Grid>
      </Grid>
      <Fab color="primary" aria-label="edit" style={ { position: 'fixed', bottom: theme.spacing(5), right: theme.spacing(5), top: 'auto', left: 'auto' } } onClick={ () => setOpen(true) }>
        <EditIcon />
      </Fab>
      <UpdateDialog open={ open } onClose={ () => setOpen(false) } />
    </AppContainer>
  )

  function BasicInfo(user: MedicalStaff) {
    const details = [
      { field: 'Name', val: user.username },
      { field: 'Birthdate', val: user.dob.toDateString() },
      { field: 'Gender', val: user.gender }
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion
        title='Basic Information'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'row-' + index }>
                  <TableCell>{ field }</TableCell>
                  <TableCell>{ val }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>
    )
  }

  function ContactInfo(user: MedicalStaff) {
    const details = [
      { field: 'Email', val: user.email }
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion
        title='Contact Information'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'row-' + index }>
                  <TableCell>{ field }</TableCell>
                  <TableCell>{ val }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>
    )
  }

  function WorkingInfo(user: MedicalStaff) {
    const { medicalInstituition } = user

    const details = [
      { field: 'Name', val: medicalInstituition.name },
      { field: 'Role', val: medicalInstituition.role },
      { field: 'Address', val: medicalInstituition.address },
      { field: 'Department', val: medicalInstituition.department }
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion
        title='Working Information'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'row-' + index }>
                  <TableCell>{ field }</TableCell>
                  <TableCell style={ { textTransform: 'capitalize' } }>{ val }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>
    )
  }

  function TimeSlotInfo(user: MedicalStaff) {
    const wt = AC.workingTimes.find(a => a.userId.toString() === user.id)
    if (wt?.type !== 'byTime') {
      return undefined
    }

    const details = [
      ...wt?.timeslots
    ].map(({ day, slots }) => ({ field: day, val: slots.map(s => FixedTime[ s ]).join(', ') }))
      .filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion
        title='Timeslots'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'row-' + index }>
                  <TableCell>{ field }</TableCell>
                  <TableCell>{ val }</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>
    )
  }
}

export default withResubAutoSubscriptions(ProfilePage)