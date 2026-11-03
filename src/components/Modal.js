import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import Overlay from './Overlay';

let nextId = 0;

export default function Modal( props ) {
	const { children, title, onDismiss } = props;
	const titleId = useRef( null );
	if ( titleId.current === null ) {
		titleId.current = 'h2-modal-title-' + nextId++;
	}

	useEffect( () => {
		const onKeyDown = e => {
			if ( e.key === 'Escape' ) {
				onDismiss();
			}
		};
		document.addEventListener( 'keydown', onKeyDown );
		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [ onDismiss ] );

	return (
		<div className="Modal fixed inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
			<Overlay
				onClick={ onDismiss }
			/>
			<div
				aria-labelledby={ titleId.current }
				aria-modal="true"
				className="relative flex flex-col w-full max-w-[560px] max-h-[min(80vh,680px)] bg-white rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.2)] overflow-hidden pointer-events-auto"
				role="dialog"
				onClick={ e => e.stopPropagation() }
			>
				<header className="flex items-center justify-between gap-3 shrink-0 pl-5 pr-3 py-3 border-b border-hm-beige">
					<h2
						className="m-0 text-lg leading-7 font-semibold normal-case"
						id={ titleId.current }
					>
						{ title }
					</h2>
					<button
						aria-label="Close"
						className="flex items-center justify-center shrink-0 size-9 m-0 p-0 border-0 rounded-md bg-transparent text-hm-dark-grey cursor-pointer hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-hm-vibrant-blue"
						type="button"
						onClick={ onDismiss }
					>
						<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
							<path d="M3 3l10 10M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
						</svg>
					</button>
				</header>
				<div className="overflow-y-auto px-5 py-4 text-[15px] leading-6 text-hm-dark-grey">
					{ children }
				</div>
			</div>
		</div>
	);
}

Modal.propTypes = {
	title: PropTypes.node.isRequired,
	onDismiss: PropTypes.func.isRequired,
};
