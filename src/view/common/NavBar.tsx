import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Avatar, Typography, useMediaQuery, Container } from '@material-ui/core'
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
            <NavLink className='navitem' to='/profile'>
              <Typography style={{display: useMediaQuery('(min-width: 600px')? 'flex': 'none'}}>{user?.username}</Typography>
              <Avatar src={user?.detail?.gender === 'F'? femaleAvatar: maleAvatar} style={{marginLeft: 10}}/>
            </NavLink>
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