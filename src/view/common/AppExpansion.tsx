import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, 
  Divider, ExpansionPanelActions, Button } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function AppExpansion(prop: AEProps) {
  const { children, defaultExpanded, title, expandIcon, actions } = prop

  return(
    <ExpansionPanel defaultExpanded={defaultExpanded}>
      <ExpansionPanelSummary
        expandIcon={expandIcon ?? <ExpandMoreIcon/>}
      >
        { 
          title
          ? <Typography>{title}</Typography>
          : null
        }
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container direction='column' spacing={1}>
          { children }
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

interface AEProps {
  children: JSX.Element[] | JSX.Element
  defaultExpanded?: boolean
  title?: string
  expandIcon?: React.ReactNode
  actions?: JSX.Element
}