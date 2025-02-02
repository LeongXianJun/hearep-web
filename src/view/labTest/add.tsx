import React, { FC, useState, useEffect } from 'react'
import {
  Grid, IconButton, Card, CardHeader, CardContent,
  CardActions, Breadcrumbs, Typography, Link, Button,
  TextField, Table, TableBody, TableRow, TableCell, FormHelperText
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'
import { Add as AddIcon, Create as CreateIcon, Delete as DeleteIcon } from '@material-ui/icons'

import { AppContainer, AppExpansion } from '../common'
import { UserStore, HealthRecordStore, AppointmentStore, Appointment } from '../../stores'

interface PageProp {

}

const AddLabTestPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const patient = HealthRecordStore.getSelectedPatient()
  const appointment = AppointmentStore.getSelectedAppointment()
  const date = new Date()

  const [ info, setInfo ] = useState({
    title: '',
    comment: ''
  })
  const [ data, setData ] = useState([ { field: '', value: '', normalRange: '' } ])

  const [ errors, setErrors ] = useState({
    title: '',
    comment: ''
  })
  const updateInfo = (field: 'title' | 'comment', value: string) => {
    setInfo({ ...info, [ field ]: value })
    if (errors[ field ] !== '')
      setErrors({ ...errors, [ field ]: '' })
  }

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ isReady, patient, history ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username },
    { path: undefined, text: 'Add new Lab Test Result' }
  ]

  const submit = () => {
    if (patient) {
      const { title, comment } = info
      HealthRecordStore.insertHealthRecord({
        type: 'Lab Test Result', appId: appointment?.id.toString(), patientId: patient.id,
        date, title, comment, data: data.filter(d => d.field !== '')
      }).then(() => {
        history.goBack()
      }).catch(err => {
        const errors: string[] = err.message.split('"healthRecord.')
        setErrors(
          errors.reduce<{
            title: string,
            comment: string
          }>((all, e) => {
            if (e.includes('title')) {
              return { ...all, 'title': e.replace('"', '') }
            } else if (e.includes('comment')) {
              return { ...all, 'comment': e.replace('"', '') }
            } else
              return all
          }, {
            title: '',
            comment: ''
          })
        )
      })
    }
  }

  return (
    <AppContainer isLoading={ isReady === false }>
      <Breadcrumbs maxItems={ 3 } aria-label="breadcrumb">
        {
          breadcrumbs.map(({ path, text }, index, arr) => (
            index === arr.length - 1 || path === undefined
              ? <Typography key={ 'l-' + index } color="textPrimary">{ text }</Typography>
              : <Link key={ 'l-' + index } color="inherit" onClick={ () => history.push(path) }>
                { text }
              </Link>
          ))
        }
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={ 3 } style={ { marginTop: 5 } }>
        <Grid item xs={ 12 } md={ 4 }>
          { LabTestDetail() }
          { appointment ? AppointmentDetail(appointment) : undefined }
        </Grid>
        <Grid item xs={ 12 } md={ 8 }>
          { LabTestResult() }
        </Grid>
      </Grid>
    </AppContainer>
  )

  function LabTestDetail() {
    return (
      <Card>
        <CardHeader title={ 'Lab Test Detail' } />
        <CardContent>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 }>
              <TextField
                variant='outlined'
                disabled
                value={ patient?.username }
                label="Patient"
                fullWidth
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                variant='outlined'
                disabled
                value={ date.toDateString() }
                label="Date"
                fullWidth
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                required
                variant='outlined'
                placeholder="Enter the main illness"
                label="Title"
                fullWidth
                error={ errors.title !== '' }
                onChange={ event => updateInfo('title', event.target.value) }
              />
              { errors.title !== ''
                ? <FormHelperText error>{ errors.title }</FormHelperText>
                : null
              }
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                required
                variant='outlined'
                placeholder="Enter your comment on this lab test"
                label="Comment"
                fullWidth
                multiline
                rows={ 3 }
                rowsMax={ 5 }
                error={ errors.comment !== '' }
                onChange={ event => updateInfo('comment', event.target.value) }
              />
              { errors.comment !== ''
                ? <FormHelperText error>{ errors.comment }</FormHelperText>
                : null
              }
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={ submit } startIcon={ <CreateIcon /> } color="primary" size='small'>
            Add new Lab Test Result
          </Button>
        </CardActions>
      </Card>
    )
  }

  function AppointmentDetail(app: Appointment) {
    const details = [
      { field: 'Address', val: app.address },
      ...app.type === 'byTime'
        ? [
          { field: 'Date', val: app.time.toDateString() },
          { field: 'Time', val: app.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) }
        ]
        : app.type === 'byNumber'
          ? [
            { field: 'Date', val: app.date.toDateString() },
            { field: 'Turn', val: app.turn + 1 }
          ]
          : []
    ].filter(({ val }) => val !== undefined && val !== '')

    return (
      <AppExpansion title={ 'Appointment Detail' }>
        <Table>
          <TableBody>
            {
              details.map(({ field, val }, index) =>
                <TableRow hover key={ 'arow-' + index }>
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

  function LabTestResult() {
    const addRow = () => {
      setData([ ...data, { field: '', value: '', normalRange: '' } ])
    }

    const removeRow = (num: number) => {
      setData([ ...data.slice(0, num), ...data.slice(num + 1) ])
    }

    const updateRow = (num: number, col: 'field' | 'value' | 'normalRange', val: string) => {
      setData([ ...data.slice(0, num), { ...data[ num ], [ col ]: val }, ...data.slice(num + 1) ])
    }

    return (
      <Card>
        <CardHeader
          title={ 'Lab Test Result' }
          action={
            <IconButton onClick={ addRow }>
              <AddIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Grid container direction='column' spacing={ 2 }>
            {
              data.map((row, index) =>
                <Grid key={ 'row-' + index } item container direction='row' spacing={ 1 } xs={ 12 }>
                  <Grid item container direction='row' spacing={ 1 } xs={ 10 } sm={ 11 }>
                    <Grid item xs={ 12 } sm={ 4 }>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter Test Component"
                        fullWidth
                        label={ "Test Component " + (index + 1) }
                        onChange={ event => updateRow(index, 'field', event.target.value) }
                      />
                    </Grid>
                    <Grid item xs={ 6 } sm={ 4 }>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Result"
                        fullWidth
                        label={ "Result " + (index + 1) }
                        onChange={ event => updateRow(index, 'value', event.target.value) }
                      />
                    </Grid>
                    <Grid item xs={ 6 } sm={ 4 }>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Normal Range"
                        fullWidth
                        label={ "Normal Range " + (index + 1) }
                        onChange={ event => updateRow(index, 'normalRange', event.target.value) }
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs alignContent='center' justify='center'>
                    <IconButton onClick={ () => removeRow(index) }>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

export default withResubAutoSubscriptions(AddLabTestPage)