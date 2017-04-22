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
        <HeaderButton />
        <HeaderButton />
      </div>
    </div>
  )
}
