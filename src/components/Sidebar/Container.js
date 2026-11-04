import React from 'react';

import TitleBar from './TitleBar';

export default function Container( props ) {
	const { children, className, title, onClose, ...otherProps } = props;
	return (
		<aside
			{ ...otherProps }
			aria-label={ title }
			tabIndex={ -1 }
			className={ [ 'Sidebar Sidebar-Container', className ].filter( Boolean ).join( ' ' ) }
		>
			<TitleBar
				title={ title }
				onClose={ onClose }
			/>

			<div className="Sidebar-browser-content">
				{ children }
			</div>
		</aside>
	);
}
