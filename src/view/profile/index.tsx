import React, { useState } from 'react'
import { AppContainer, AppExpansion } from '../common'
import { Typography, Grid, Table, TableBody, TableRow, 
  TableCell, Fab, useTheme, Avatar } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import UC, { User } from '../../connections/UserConnection'
import AC, { FixedTime } from '../../connections/AppointmentConnection'
import UpdateDialog from './update'

import maleAvatar from '../../resources/images/maleAvatar.png'
import femaleAvatar from '../../resources/images/femaleAvatar.png'

export default function ProfilePage() {
  const theme = useTheme()
  const [ open, setOpen ] = useState(false)
  const uc = UC.currentUser

  return(
    <AppContainer>
      <Grid container spacing={3}>
        <Grid item container direction='column' justify='center' alignContent='center' spacing={3}>
          <Grid item>
            <Avatar style={{ margin: 'auto', display: 'block', width: theme.spacing(20), height: theme.spacing(20) }} alt='num' src={uc?.detail?.gender === 'F'? femaleAvatar: maleAvatar}/>
          </Grid>
          <Grid item>
            <Typography variant='h4'>{uc?.detail?.fullname}</Typography>
          </Grid>
        </Grid>
        <Grid item container direction='row' spacing={3} xs={12}>
          <Grid item container direction='column' xs={12} sm={6} spacing={2}>
            <Grid item>
              { uc && BasicInfo(uc) }
            </Grid>
            <Grid item>
              { uc? ContactInfo(uc): undefined }
            </Grid>
          </Grid>
          <Grid item container direction='column' xs={12} sm={6} spacing={2}>
            <Grid item>
              { uc && WorkingInfo(uc) }
            </Grid>
            <Grid item>
              { uc && TimeSlotInfo(uc) }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Fab color="primary" aria-label="edit" style={{ position: 'fixed', bottom: theme.spacing(5), right: theme.spacing(5), top: 'auto', left: 'auto'}} onClick={() => setOpen(true)}>
        <EditIcon />
      </Fab>
      <UpdateDialog open={open} onClose={() => setOpen(false)}/>
    </AppContainer>
  )

  function BasicInfo(user: User) {
    const {detail} = user
    
    const details = [
      { field: 'Name', val: detail?.fullname },
      { field: 'Age', val: detail?.age },
      { field: 'Gender', val: detail?.gender }
    ].filter(({val}) => val !== undefined && val !== '')
    
    return (
      <AppExpansion
        title='Basic Information'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({field, val}, index) => 
                <TableRow hover key={'row-' + index}>
                  <TableCell>{field}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>  
    )
  }

  function ContactInfo(user: User) {
    const {detail} = user
    
    const details = [
      { field: 'Email', val: user.email },
      { field: 'Alternative Email', val: detail?.contacts?.find(c=> c.type === 'email')?.value },
      { field: 'Contact Number', val: detail?.contacts?.find(c=> c.type === 'phone')?.value }
    ].filter(({val}) => val !== undefined && val !== '')
    
    return (
      <AppExpansion
        title='Contact Information'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({field, val}, index) => 
                <TableRow hover key={'row-' + index}>
                  <TableCell>{field}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>  
    )
  }

  function WorkingInfo(user: User) {    
    if(user.type !== 'medicalStaff') {
      return undefined
    }

    const details = [
      { field: 'Name', val: user.medicalInstituition?.name },
      { field: 'Role', val: user.medicalInstituition?.role },
      { field: 'Address', val: user.medicalInstituition?.address },
      { field: 'Department', val: user.medicalInstituition?.department }
    ].filter(({val}) => val !== undefined && val !== '')
    
    return (
      <AppExpansion 
        title='Working Information'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({field, val}, index) => 
                <TableRow hover key={'row-' + index}>
                  <TableCell>{field}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>  
    )
  }

  function TimeSlotInfo(user: User) {
    const wt = AC.workingTimes.find(a => a.userId === user.id)
    if(wt?.type !== 'byTime') {
      return undefined
    }

    const details = [
      ...wt?.timeslots
    ].map(({day, slots}) => ({ field: day, val: slots.map(s => FixedTime[s]).join(', ')}))
    .filter(({val}) => val !== undefined && val !== '')
    
    return (
      <AppExpansion 
        title='Timeslots'
        defaultExpanded
      >
        <Table>
          <TableBody>
            {
              details.map(({field, val}, index) => 
                <TableRow hover key={'row-' + index}>
                  <TableCell>{field}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </AppExpansion>  
    )
  }
}