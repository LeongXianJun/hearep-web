import React, { FC, useState, useEffect } from 'react'
import {
  Typography, Grid, Table, TableBody, TableRow,
  TableCell, Fab, useTheme, Avatar
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { withResubAutoSubscriptions } from 'resub'

import UpdateDialog from './update'
import { CommonUtil } from '../../utils'
import { maleAvatar, femaleAvatar } from '../../resources/images'
import { AppContainer, AppExpansion, ReloadButton } from '../common'
import { UserStore, MedicalStaff, WorkingTimeStore, ByTimeWT, ByNumberWT } from '../../stores'

interface PageProp {

}

const ProfilePage: FC<PageProp> = () => {
  const theme = useTheme()
  const user = UserStore.getUser()
  const isReady = UserStore.ready()
  const TimeInterval = WorkingTimeStore.getTimeInterval()

  const [ isLoading, setIsLoading ] = useState(true)
  const [ isFetching, setIsFetching ] = useState(false)
  const [ open, setOpen ] = useState(false)

  const onLoad = () => {
    setIsFetching(true)
    return UserStore.fetchUser()
      .then(() => setIsFetching(false))
  }

  useEffect(() => {
    return UserStore.unsubscribe
  }, [])

  useEffect(() => {
    if (isReady && isLoading) {
      WorkingTimeStore.fetchTimeInterval()
        .finally(() => setIsLoading(false))
    }
  }, [ isReady, isLoading ])

  return (
    <AppContainer isLoading={ isLoading }>
      <Grid container spacing={ 3 } justify='center'>
        <Grid item container direction='column' justify='center' alignContent='center' spacing={ 3 }>
          <Grid item>
            <Avatar style={ { margin: 'auto', display: 'block', width: theme.spacing(20), height: theme.spacing(20) } } alt='num' src={ user?.gender === 'F' ? femaleAvatar : maleAvatar } />
          </Grid>
          <Grid item container direction='row' justify='center'>
            <Typography variant='h4' align='center'>{ user?.username }</Typography>
            <ReloadButton isSubmitting={ isFetching } onClick={ () => { onLoad() } } />
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
                  { user.workingTime !== undefined
                    ? <Grid item>
                      { TimeSlotInfo(user.workingTime) }
                    </Grid>
                    : undefined
                  }
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

  function TimeSlotInfo(wt: ByTimeWT | ByNumberWT) {
    const details = [
      ...wt.type === 'byTime'
        ? [
          ...wt.timeslots.map(ts => ({
            field: CommonUtil.getDayOfWeek(ts.day),
            val: ts.slots.map(s => TimeInterval[ parseInt(s.toString()) ]?.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })).join(', ')
          }))
        ]
        : wt.type === 'byNumber'
          ? [
            ...wt.timeslots.map(ts => ({
              field: CommonUtil.getDayOfWeek(ts.day),
              val: ts.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) + ' - ' + ts.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
            }))
          ]
          : []
    ]

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