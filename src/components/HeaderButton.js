// @flow
import React from 'react';
import './HeaderButton.css';

export default function HeaderButton(props) {
	return (
    <div className="HeaderButton" onClick="">
      {props.title}
    </div>
  )
}
