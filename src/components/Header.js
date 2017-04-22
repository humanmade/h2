// @flow
import React from 'react';
import './Header.css';

export default function Header(props) {
	return (
    <div className="Header">
      <div className="Inner">
        {props.children}
      </div>
    </div>
  )
}
