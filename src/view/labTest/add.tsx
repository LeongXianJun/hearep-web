import React, { useState } from 'react'
import { AppContainer, AppExpansion } from '../common'
import { Grid, IconButton,
  Card, CardHeader, CardContent, CardActions, Breadcrumbs, 
  Typography, Link, Button, TextField, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import UC from '../../connections/UserConnection'
import RC from '../../connections/RecordConnection'
import AC, { Appointment } from '../../connections/AppointmentConnection'
import { useHistory } from 'react-router-dom'

export default function AddLabTestPage() {
  const history = useHistory()
  const app = AC.selectedApp
  const patientName = UC.selectedPatient?.detail?.fullname ?? ''
  const date = new Date()
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [data, setData] = useState([{ field: '', result: '', normalRange: '' }])

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: patientName },
    { path: undefined, text: 'Add new Lab Test Result'}
  ]

  const submit = () => {
    RC.addNewLabTestResult(patientName, title, comment, data, app.id)
    history.goBack()
  }

  return(
    <AppContainer>
      <Breadcrumbs maxItems={3} aria-label="breadcrumb">
        {
          breadcrumbs.map(({path, text}, index, arr) => (
            index === arr.length - 1 || path === undefined
            ? <Typography key={'l-' + index} color="textPrimary">{text}</Typography>
            : <Link key={'l-' + index} color="inherit" href={path}>
                {text}
              </Link>
          ))
        }        
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={3} style={{marginTop: 5}}>
        <Grid item xs={12} md={4}>
          { LabTestDetail() }
          { AppointmentDetail(app) }
        </Grid>
        <Grid item xs={12} md={8}>
          { LabTestResult() }
        </Grid>
      </Grid>
    </AppContainer>
  )

  function LabTestDetail() {
    return (
      <Card>
        <CardHeader title={'Lab Test Detail'}/>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                disabled
                value={patientName}
                label="Patient"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                disabled
                value={date.toDateString()}
                label="Date"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                variant='outlined'
                placeholder="Enter the main illness"
                label="Title"
                fullWidth
                onChange = {event => setTitle(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                variant='outlined'
                placeholder="Enter your comment on this lab test"
                label="Comment"
                fullWidth
                multiline
                rows={3}
                rowsMax={5}
                onChange = {event => setComment(event.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={submit} color="primary" size='small'>
            Add new Lab Test Result
          </Button>
        </CardActions>
      </Card>
    )
  }

  function AppointmentDetail(app: Appointment) {
    const details = [
      { field: 'Date', val: app?.date.toDateString() },
      { field: 'Time', val: app?.type === 'byTime'? app.time: undefined }
    ].filter(({val}) => val !== undefined && val !== '')

    return (
      <AppExpansion title={'Appointment Detail'}>
        <Table>
          <TableBody>
            {
              details.map(({field, val}, index) => 
                <TableRow hover key={'arow-' + index}>
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

  function LabTestResult() {
    const addRow = () => {
      setData([...data, { field: '', result: '', normalRange: '' }])
    }

    const removeRow = (num: number) => {
      setData([...data.slice(0, num), ...data.slice(num + 1)])
    }

    const updateRow = (num: number, col: 'field' | 'result' | 'normalRange', val: string) => {
      setData([...data.slice(0, num), { ...data[num], [col]: val }, ...data.slice(num + 1) ])
    }

    return (
      <Card>
        <CardHeader 
          title={'Lab Test Result'}
          action={
            <IconButton  onClick={addRow}>
              <AddIcon/>
            </IconButton>
          }
        />
        <CardContent>
          <Grid container direction='column' spacing={2}>
            {
              data.map((row, index) => 
                <Grid key={'row-' + index} item container direction='row' spacing={1} xs={12}>
                  <Grid item container direction='row' spacing={1} xs={10} sm={11}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter Test Component"
                        fullWidth
                        label={"Test Component " + (index + 1)}
                        onChange = {event => updateRow(index, 'field', event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Result"
                        fullWidth
                        label={"Result " + (index + 1)}
                        onChange = {event => updateRow(index, 'result', event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Enter the Normal Range"
                        fullWidth
                        label={"Normal Range " + (index + 1)}
                        onChange = {event => updateRow(index, 'normalRange', event.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs alignContent='center' justify='center'>
                    <IconButton onClick={() => removeRow(index)}>
                      <DeleteIcon/>
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