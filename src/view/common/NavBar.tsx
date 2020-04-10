import React, { Component } from 'react'
import icon from '../../resources/logo/icon.svg';
import title from '../../resources/logo/title.svg';
import UC from '../../connections/UserConnection'
import { NavLink } from 'react-router-dom';
import './navbar.css'

/**
 * Got 2 modes, which is 
 * 1) Before login
 * 2) After login
 */
const links: {before: LinkRoute[], after: LinkRoute[]} = {
  before: [
    { path: '/', name: 'Home' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' }
  ],
  after: [
  ]
}

export default class NavBar extends Component<NavBarProps, NavBarStates> {
  renderNavLinkLists = (): JSX.Element[]  => {
    const { currentRouteName } = this.props

    if(UC.isLogin()) {
      return links.after.map(link => this.renderNavLink(link, link.path === currentRouteName))
    } else {
      return links.before.map(link => this.renderNavLink(link, link.path === currentRouteName))
    }
  }

  renderNavLink = ({path, name}: LinkRoute, isCurrent: boolean): JSX.Element => (
    isCurrent
    ? <NavLink key={'l' + name} aria-current='page' className='highlighted' to={path}>{name}
        <span className='underline'></span>
      </NavLink>
    : <NavLink key={'l' + name} className='navitem' to={path}>{name}</NavLink>
  )

  render() {
    const { hasTitle } = this.props
    return(
      <header className='header'>
        <div className='container'>
          <div className='top'>
            <a className='brand' href='/'>
              <img src={icon} className='brand-icon' alt='logo' height='20'/>
              {hasTitle && <img src={title} alt='title' height='30'/>}
            </a>
            <nav className='navbar'>
              { this.renderNavLinkLists() }
            </nav>
          </div>
        </div>
      </header>
    )
  }
}

interface NavBarProps {
  currentRouteName: string
  hasTitle?: boolean
}

interface NavBarStates {}

interface LinkRoute {
  path: string
  name: string
}