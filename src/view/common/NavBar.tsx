import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Avatar, Typography, useMediaQuery, Container, Button, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core'
import UC from '../../connections/UserConnection'

import icon from '../../resources/logo/icon.svg'
import title from '../../resources/logo/title.svg'
import maleAvatar from '../../resources/images/maleAvatar.png'
import femaleAvatar from '../../resources/images/femaleAvatar.png'

import './navbar.css'

/**
 * Got 2 modes, which is 
 * 1) Before login
 * 2) After login
 * 
 * --> show after login only
 */
const links: LinkRoute[] =  [
  { path: '/dashboard', name: 'Home' },
  { path: '/patient', name: 'Patient' },
  { path: '/appointment', name: 'Appointment' }
]

export default function NavBar() {
  const history = useHistory()
  const user = UC.currentUser
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

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
    UC.logout()
    history.replace('/login')
  }

  const renderNavLinkLists = (): JSX.Element[]  => 
    links.map(link => renderNavLink(link, history.location.pathname.includes(link.path)))

  const renderNavLink = ({path, name}: LinkRoute, isCurrent: boolean): JSX.Element => (
    isCurrent
    ? <NavLink key={'l' + name} aria-current='page' className='highlighted' to={path}>{name}
        <span className='underline'></span>
      </NavLink>
    : <NavLink key={'l' + name} className='navitem' to={path}>{name}</NavLink>
  )

  
  return(
    <header className='header'>
      <Container>
        <div className='top'>
          <a className='brand' href='/dashboard'>
            <img src={icon} className='brand-icon' alt='logo' height='20'/>
            <img src={title} alt='title' height='30'/>
          </a>
          <nav className='navbar'>
            { renderNavLinkLists() }
          </nav>
          <div className='leftBar'>
            <Button
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <Typography style={{display: useMediaQuery('(min-width: 600px')? 'flex': 'none', color: 'white'}}>{user?.username}</Typography>
              <Avatar src={user?.detail?.gender === 'F'? femaleAvatar: maleAvatar} style={{marginLeft: 10}}/>
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <MenuItem onClick={() => history.replace('/profile')}>Profile</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
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