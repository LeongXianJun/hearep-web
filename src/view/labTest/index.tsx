import React from 'react'
import { AppContainer, AppTable } from '../common'
import { Grid, Card, CardHeader, CardContent, Breadcrumbs, 
  Typography, Link } from '@material-ui/core'
import RC, { LabTestResult } from '../../connections/RecordConnection'
 
export default function LabTestPage() {
  const record = RC.selectedRecord

  const breadcrumbs = [
    { path: '/dashboard', text: 'Home' },
    { path: '/patient', text: 'Patient' },
    { path: '/patient/detail', text: record.name },
    { path: '/labTest', text: 'Lab Test on ' + record.date.toDateString() }
  ]

  return(
    <AppContainer>
      <Breadcrumbs maxItems={3} aria-label="breadcrumb">
        {
          breadcrumbs.map(({path, text}, index, arr) => (
            index === arr.length - 1
            ? <Typography key={'l-' + index} color="textPrimary">{text}</Typography>
            : <Link key={'l-' + index} color="inherit" href={path}>
                {text}
              </Link>
          ))
        }        
      </Breadcrumbs>
      <Grid container direction='row' justify='center' spacing={3} style={{marginTop: 5}}>
        <Grid item xs={12} md={4}>
          { record.type === 'lab test result' && LabTestDetail({data: record}) }
        </Grid>
        <Grid item xs={12} md={8}>
          { record.type === 'lab test result' && LabTestResult({data: record}) }
        </Grid>
      </Grid>
    </AppContainer>
  )

  function LabTestDetail(props: LabTestDetailProps) {
    const { data } = props
    const details = [
      { field: 'Patient Name', val: data.name },
      { field: 'Test Title', val: data.title },
      { field: 'Test Date', val: data.date.toDateString() },
      { field: 'Comment', val: data.comment }
    ]

    return (
      <Card>
        <CardHeader title={'Lab Test Information'}/>
        <CardContent>
          <Grid container direction='column' spacing={2}>
            {
              details.map(({field, val}) => 
                <Grid item container direction='row' xs={12}>
                  <Grid item xs={12} sm={4}>
                    <Typography>{field}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography>{val}</Typography>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </CardContent>
      </Card>

    )
  }

  function LabTestResult(props: LabTestResultProps) {
    const { data: { data } } = props
    const columns = [
      { title: 'Test Component', field: 'field' },
      { title: 'Result', field: 'result' },
      { title: 'Normal Range', field: 'normalRange' }
    ]
    return (
      <AppTable
        title={'Lab Test Result'}
        columns={columns}
        data={data}
      />
      )
    }
  }
  
interface LabTestDetailProps {
  data: LabTestResult
}

interface LabTestResultProps {
  data: LabTestResult
}