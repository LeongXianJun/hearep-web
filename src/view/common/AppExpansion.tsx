import React, { FC } from 'react'
import {
  ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid,
  Divider, ExpansionPanelActions
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface ComponentProp {
  children: JSX.Element[] | JSX.Element
  defaultExpanded?: boolean
  title?: string
  expandIcon?: React.ReactNode
  actions?: JSX.Element
}

const AppExpansion: FC<ComponentProp> = ({ children, defaultExpanded, title, expandIcon, actions }) => {
  return (
    <ExpansionPanel defaultExpanded={ defaultExpanded } style={ { width: '100%' } }>
      <ExpansionPanelSummary
        expandIcon={ expandIcon ?? <ExpandMoreIcon /> }
      >
        {
          title
            ? <Typography>{ title }</Typography>
            : null
        }
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container direction='column' spacing={ 1 }>
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

export default AppExpansion