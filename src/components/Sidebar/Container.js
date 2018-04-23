import React from 'react';

import TitleBar from './TitleBar';

import './Container.css';

export default function Container( props ) {
	const { children, className, title, onClose, ...otherProps } = props;
	return (
		<aside
			{ ...otherProps }
			className={ `Sidebar-Container ${ props.className || '' } ` }
		>
			<TitleBar
				title={ title }
				onClose={ onClose }
			/>

			{ children }
		</aside>
	);
}
