import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Avatar, Typography, useMediaQuery } from '@material-ui/core'

import icon from '../../resources/logo/icon.svg'
import title from '../../resources/logo/title.svg'
import avatar from '../../resources/images/avatar.jpg'

import './navbar.css'

/**
 * Got 2 modes, which is 
 * 1) Before login
 * 2) After login
 * 
 * --> show after login only
 */
const links: LinkRoute[] =  [
  { path: '/dashboard', name: 'Home' }
  // { path: '/patient', name: 'Patient' },
  // { path: '/appointment', name: 'Appointment' }
]

export default function NavBar() {
  const history = useHistory()
  const renderNavLinkLists = (): JSX.Element[]  => 
    links.map(link => renderNavLink(link, link.path === history.location.pathname))

  const renderNavLink = ({path, name}: LinkRoute, isCurrent: boolean): JSX.Element => (
    isCurrent
    ? <NavLink key={'l' + name} aria-current='page' className='highlighted' to={path}>{name}
        <span className='underline'></span>
      </NavLink>
    : <NavLink key={'l' + name} className='navitem' to={path}>{name}</NavLink>
  )
  
  return(
    <header className='header'>
      <div className='container'>
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
              <Typography style={{display: useMediaQuery('(min-width: 600px')? 'flex': 'none'}}>{'Leong Xian Jun'}</Typography>
              <Avatar src={avatar} style={{marginLeft: 10}}/>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

interface LinkRoute {
  path: string
  name: string
}