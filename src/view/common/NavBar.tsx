import React, { FC, useEffect, useState, useRef } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import {
  Avatar, Typography, useMediaQuery, Container, Button,
  Popper, Grow, Paper, ClickAwayListener, MenuList,
  MenuItem
} from '@material-ui/core'
import { withResubAutoSubscriptions } from 'resub'

import './navbar.css'
import { AuthUtil } from '../../utils'
import { UserStore } from '../../stores'
import { title, icon } from '../../resources/logo'
import { maleAvatar, femaleAvatar } from '../../resources/images'

const links: LinkRoute[] = [
  { path: '/dashboard', name: 'Home' },
  { path: '/patient', name: 'Patient' },
  { path: '/appointment', name: 'Appointment' }
]

interface ComponentProp {

}

const NavBar: FC<ComponentProp> = () => {
  const history = useHistory()
  const user = UserStore.getUser()

  const [ open, setOpen ] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return UserStore.unsubscribe
  }, [])

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const logout = () => {
    // UC.logout()
    AuthUtil.signOut()
      .then(() => {
        history.replace('/login')
      })
  }

  const renderNavLinkLists = (): JSX.Element[] =>
    links.map(link => renderNavLink(link, history.location.pathname.includes(link.path)))

  const renderNavLink = ({ path, name }: LinkRoute, isCurrent: boolean): JSX.Element => (
    isCurrent
      ? <NavLink key={ 'l' + name } aria-current='page' className='highlighted' to={ path }>{ name }
        <span className='underline'></span>
      </NavLink>
      : <NavLink key={ 'l' + name } className='navitem' to={ path }>{ name }</NavLink>
  )

  return (
    <header className='header'>
      <Container>
        <div className='top'>
          <a className='brand' href='/dashboard'>
            <img src={ icon } className='brand-icon' alt='logo' height='20' />
            <img src={ title } alt='title' height='30' />
          </a>
          <nav className='navbar'>
            { renderNavLinkLists() }
          </nav>
          <div className='leftBar'>
            <Button
              ref={ anchorRef }
              aria-controls={ open ? 'menu-list-grow' : undefined }
              aria-haspopup="true"
              onClick={ handleToggle }
            >
              <Typography style={ { display: useMediaQuery('(min-width: 600px') ? 'flex' : 'none', color: 'white', textTransform: 'capitalize' } }>{ user?.username }</Typography>
              <Avatar src={ user?.gender === 'F' ? femaleAvatar : maleAvatar } style={ { marginLeft: 10 } } />
            </Button>
            <Popper open={ open } anchorEl={ anchorRef.current } role={ undefined } transition disablePortal>
              { ({ TransitionProps, placement }) => (
                <Grow
                  { ...TransitionProps }
                  style={ { transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' } }
                >
                  <Paper>
                    <ClickAwayListener onClickAway={ handleClose }>
                      <MenuList autoFocusItem={ open } id="menu-list-grow" onKeyDown={ handleListKeyDown }>
                        <MenuItem onClick={ () => history.replace('/profile') }>Profile</MenuItem>
                        <MenuItem onClick={ logout }>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              ) }
            </Popper>
          </div>
        </div>
      </Container>
    </header>
  )
}

interface LinkRoute {
  path: string
  name: string
}

export default withResubAutoSubscriptions(NavBar)