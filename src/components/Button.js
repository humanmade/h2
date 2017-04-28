// @flow
import React from 'react';
import './Button.css';

export default function Button(props: { children?: any, onClick: () => mixed }) {
	return (
		<button onClick={props.onClick} className="Button">
			{props.children}
		</button>
	);
}
