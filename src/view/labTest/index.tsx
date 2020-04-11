import React, { forwardRef } from 'react'
import { AppContainer } from '../common'
import { Grid, Card, CardHeader, CardContent, Breadcrumbs, 
  Typography, Link } from '@material-ui/core'
import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, 
  Clear, DeleteOutline, Edit, FilterList, FirstPage, 
  LastPage, Remove, SaveAlt, Search, ViewColumn } from '@material-ui/icons'
import RC, { LabTestResult } from '../../connections/RecordConnection'
import MaterialTable, { Icons } from 'material-table'
 
export default function LabTestPage() {
  const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
  };
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
      { title: 'Component', field: 'field' },
      { title: 'Result', field: 'result' },
      { title: 'Normal Range', field: 'normalRange' }
    ]
    return (
      <MaterialTable
        title={'Lab Test Result'}
        icons={tableIcons}
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