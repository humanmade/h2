import React from 'react';

export default function Chevron( { direction = 'right' } ) {
	return (
		<svg aria-hidden="true" className={ `Sidebar-chevron Sidebar-chevron--${ direction }` } viewBox="0 0 16 16" width="16" height="16">
			<path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}
