import React, { Component } from 'react';
import icon from '../resources/logo/icon.svg';
import title from '../resources/logo/title.svg';
import slogan from '../resources/logo/slogan.svg';
import './App.css';
import NavBar from './common/NavBar';

export default class HomePage extends Component {
  render() {
    return(
      <>
        <NavBar currentRouteName='/'/>
        <div className='App-body'>
          <img src={icon} className='App-icon' alt='logo' />
          <img src={title} className='App-title' alt='logo' />
          <img src={slogan} className='App-slogan' alt='logo' />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </div>
      </>
    )
  }
}
