import React from 'react';

import TitleBar from './TitleBar';

const BASE_CLASSES = [
	// Back-compat:
	'Sidebar-Container',

	'text-[0.8em] mt-[1em] px-[1em]',
	'border-l border-r border-solid border-hm-beige',
].join( ' ' );

export default function Container( props ) {
	const { children, className, title, onClose, ...otherProps } = props;
	return (
		<aside
			{ ...otherProps }
			className={ [ BASE_CLASSES, className ].filter( Boolean ).join( ' ' ) }
		>
			<TitleBar
				title={ title }
				onClose={ onClose }
			/>

			{ children }
		</aside>
	);
}
