import React, { FC } from 'react'
import {
  ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid,
  Divider, ExpansionPanelActions, CircularProgress
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface ComponentProp {
  children: JSX.Element[] | JSX.Element
  defaultExpanded?: boolean
  title?: string
  subtitle?: string
  expandIcon?: React.ReactNode
  actions?: JSX.Element
  isLoading?: boolean
}

const AppExpansion: FC<ComponentProp> = ({ children, defaultExpanded, title, subtitle, expandIcon, actions, isLoading = false }) => {
  return (
    <ExpansionPanel defaultExpanded={ defaultExpanded } style={ { width: '100%' } }>
      <ExpansionPanelSummary
        expandIcon={ expandIcon ?? <ExpandMoreIcon /> }
      >
        <Grid container direction='row'>
          {
            title
              ? <Grid item xs={ 12 }>
                <Typography variant='h6'>{ title }</Typography>
              </Grid>
              : null
          }
          {
            subtitle
              ? <Grid item xs={ 12 }>
                <Typography variant='subtitle1'>{ subtitle }</Typography>
              </Grid>
              : null
          }
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container direction='column' spacing={ 1 }>
          {
            isLoading
              ? <Grid container direction='column' justify='center' alignItems='center' style={ { height: 200 } }>
                <CircularProgress size={ 50 } />
              </Grid>
              : children
          }
        </Grid>
      </ExpansionPanelDetails>
      {
        actions
          ? <>
            <Divider />
            <ExpansionPanelActions>
              { actions }
            </ExpansionPanelActions>
          </>
          : undefined
      }
    </ExpansionPanel>
  )
}

export default AppExpansion