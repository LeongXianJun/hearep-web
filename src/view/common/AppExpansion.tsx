import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function AppExpansion(prop: AEProps) {
  const { children, title, expandIcon } = prop

  return(
    <ExpansionPanel>
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
    </ExpansionPanel>
  )
}

interface AEProps {
  children: JSX.Element[] | JSX.Element
  title?: string
  expandIcon?: React.ReactNode
}