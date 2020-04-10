import React, { useState, Fragment } from 'react';
import Modal from './Modal';

import './ImageLink.css';

export default function ImageLink( props ) {
	const { href, className, children } = props;
	const [ isModalOpen, setModalOpenState ] = useState( false );

	return (
		<Fragment>
			<a
				{ ...props }
				href={ href }
				className={ `ImageLink ${ className || '' }` }
				onClick={ e => {
					setModalOpenState( true );
					e.preventDefault();
					return false;
				} }
			>
				{ children }
			</a>
			{ isModalOpen && (
				<Modal onDismiss={ () => setModalOpenState( false ) } className='Modal--Image'>
					{ children }
				</Modal>
			)}
		</Fragment>
	);
}
