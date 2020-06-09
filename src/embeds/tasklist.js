import React from 'react';

export const parseCheckboxInput = node => {
	if ( node.type !== 'checkbox' ) {
		return;
	}

	// Pass through checkboxes, forcing them to "disabled".
	return (
		<input type="checkbox" checked={ node.checked } disabled />
	);
};

export const parseListItem = ( node, children ) => {
	const hasCheckbox = children.reduce( ( hasCheckbox, child ) => {
		return hasCheckbox || child.type === 'input';
	}, false );

	if ( ! hasCheckbox ) {
		return;
	}

	return (
		<li className="Tasklist-Item"><label>{ children }</label></li>
	);
};
