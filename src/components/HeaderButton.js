// @flow
import React from 'react';
import './HeaderButton.css';

export default function HeaderButton(
	props: { title: string, onClick: () => void }
) {
	return (
		<button onClick={props.onClick} className="HeaderButton">
			{props.title}
		</button>
	);
}
