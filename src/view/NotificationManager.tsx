import React, { FC, useEffect, useState } from 'react'
import {
  Card, CardActions, IconButton, Paper, Collapse,
  makeStyles, Typography
} from '@material-ui/core'
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import { withResubAutoSubscriptions } from 'resub'
import { useSnackbar } from 'notistack'

import { NotificationStore } from '../stores'

interface ManagerProps {
  children: React.ReactNode
}

const NotificationManager: FC<ManagerProps> = ({ children }) => {
  const notifications = NotificationStore.getNotifications()

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    return NotificationStore.unsubscribeOnTokenRefresh
  }, [])

  useEffect(() => {
    notifications.forEach(n => {
      enqueueSnackbar('hihi', {
        content: key =>
          <CustomSnackBar id={ key } message={ n } />
      })
    })
  }, [ notifications, enqueueSnackbar ])

  return <>
    { children }
  </>
}

export default withResubAutoSubscriptions(NotificationManager)


const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flexGrow: 1,
    backgroundColor: '#fddc6c',
    [ theme.breakpoints.up('sm') ]: {
      flexGrow: 'initial',
      minWidth: 344,
    },
  },
  typography: {
    fontWeight: 'bold',
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
  },
  expand: {
    padding: '8px 8px',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  collapse: {
    padding: 16,
  },
  checkIcon: {
    fontSize: 20,
    color: '#b3b3b3',
    paddingRight: 4,
  },
  button: {
    padding: 0,
    textTransform: 'none',
  },
}))

interface ComponentProps {
  id: React.ReactText
  message: { title: string, description: string }
}

const CustomSnackBar: FC<ComponentProps> = React.forwardRef(({ id, message }, ref) => {
  const classes = useStyles()
  const { closeSnackbar } = useSnackbar()
  const [ expanded, setExpanded ] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleDismiss = () => {
    closeSnackbar(id)
  }

  return <Card className={ classes.card } ref={ ref }>
    <CardActions className={ classes.actionRoot }>
      <Typography variant='subtitle2' className={ classes.typography }>{ message.title }</Typography>
      <div style={ { marginLeft: 'auto' } }>
        <IconButton
          aria-label="Show more"
          className={ classes.expand + ' ' + (expanded ? classes.expandOpen : '') }
          onClick={ handleExpandClick }
        >
          <ExpandMoreIcon />
        </IconButton>
        <IconButton className={ classes.expand } onClick={ handleDismiss }>
          <CloseIcon />
        </IconButton>
      </div>
    </CardActions>
    <Collapse in={ expanded } timeout="auto" unmountOnExit>
      <Paper className={ classes.collapse }>
        <Typography gutterBottom>{ message.description }</Typography>
      </Paper>
    </Collapse>
  </Card>
})