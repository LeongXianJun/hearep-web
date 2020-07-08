import React, { FC, useState, useEffect } from 'react'
import {
  Grid, IconButton, Card, CardHeader, CardContent,
  CardActions, Breadcrumbs, Typography, Link, Button,
  TextField, FormHelperText
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { withResubAutoSubscriptions } from 'resub'
import { Add as AddIcon, Delete as DeleteIcon, Update as UpdateIcon } from '@material-ui/icons'

import { AppContainer } from '../common'
import { UserStore, HealthRecordStore } from '../../stores'

interface PageProp {

}

const UpdateLabTestPage: FC<PageProp> = () => {
  const history = useHistory()
  const isReady = UserStore.ready()
  const record = HealthRecordStore.getSelectedLTRRecord()
  const patient = HealthRecordStore.getSelectedPatient()

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
    if (record) {
      setInfo({ title: record.title, comment: record.comment })
      setData(record.data)
    }
  }, [ record ])

  useEffect(() => {
    if (isReady && patient === undefined) {
      history.replace('/patient')
    }
  }, [ isReady, patient, history ])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patient?.username },
    { path: '/labTest', text: 'Lab Test on ' + record?.date.toDateString() },
    { path: undefined, text: 'Update Lab Test Result' }
  ]

  const submit = () => {
    if (record) {
      const { title, comment } = info
      const validData = data.reduce<typeof data>((all, d) => {
        if (d.field !== '') {
          return [ ...all, { field: d.field, normalRange: d.normalRange, value: d.value } ]
        } else {
          return all
        }
      }, [])
      HealthRecordStore.updateHealthRecord({
        type: 'Lab Test Result', id: record.id, patientId: record.patientId,
        title, comment, data: validData
      }).then(() => {
        history.goBack()
      }).catch(err => {
        console.log(err)
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
                value={ record?.date.toDateString() }
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
                value={ info.title }
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
                value={ info.comment }
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
          <Button onClick={ submit } startIcon={ <UpdateIcon /> } color="primary" size='small'>
            Update Lab Test Result
          </Button>
        </CardActions>
      </Card>
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
                        value={ row.field }
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
                        value={ row.value }
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
                        value={ row.normalRange }
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

export default withResubAutoSubscriptions(UpdateLabTestPage)