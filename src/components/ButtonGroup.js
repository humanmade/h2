import PropTypes from 'prop-types';
import React from 'react';

const CLASSES = [
	// Back-compat:
	'ButtonGroup',

	'whitespace-nowrap',

	// Reset margin on child buttons.
	'[&>.btn]:m-0',

	// Remove right rounding on all but last button.
	'[&>.btn:nth-last-child(n+2)]:rounded-r-none',

	// Remove left rounding and overlap border on all but first button.
	'[&>.btn:nth-child(n+2)]:rounded-l-none',
	'[&>.btn:nth-child(n+2)]:-ml-px',
].join( ' ' );

export default function ButtonGroup( props ) {
	const className = [ CLASSES, props.className ].filter( Boolean ).join( ' ' );

	return (
		<div className={ className }>
			{ props.children }
		</div>
	);
}

ButtonGroup.propTypes = {
	className: PropTypes.string,
};
