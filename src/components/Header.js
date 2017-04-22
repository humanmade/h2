// @flow
import React from 'react';
import './Header.css';
import HeaderButton from './HeaderButton';
import Logo from './Logo';

export default function Header(props) {
	return (
    <div className="Header">
      <div className="Inner">
        <Logo />
        <HeaderButton
          title='+ New Post'
          path='new-post'
        />
        <HeaderButton
          title='+ New Status'
          path='new-status'
        />
      </div>
    </div>
  )
}
