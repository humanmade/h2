import React, { useEffect } from 'react';

import Overlay from './Overlay';
import TitleBar from './Sidebar/TitleBar';

import './Modal.css';

export default function Modal( props ) {
	const { children, title, className, onDismiss } = props;
	const onKeyUp = e => e.key === 'Escape' && onDismiss();

	// Allow using ESCAPE button to dismiss the modal
	useEffect( () => {
		document.addEventListener( 'keyup', onKeyUp );

		return () => document.removeEventListener( 'keyup', onKeyUp );
	}, [] );

	return (
		<div className={ `Modal ${ className }` }>
			<Overlay
				onClick={ onDismiss }
			/>
			<div
				className="Modal-inner"
				onClick={ e => e.stopPropagation() }
			>
				<TitleBar
					title={ title }
					onClose={ onDismiss }
				/>

				{ children }
			</div>
		</div>
	);
}
