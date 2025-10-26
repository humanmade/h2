import React from 'react';

import Overlay from './Overlay';
import TitleBar from './Sidebar/TitleBar';

export default function Modal( props ) {
	const { children, title, onDismiss } = props;

	return (
		<div className="Modal flex justify-center items-center fixed inset-0 z-20 pointer-events-none">
			<Overlay
				onClick={ onDismiss }
			/>
			<div
				className="relative bg-white w-[90vw] max-w-[600px] h-[80vh] max-h-[600px] px-4 py-0 shadow-sm rounded overflow-auto pointer-events-auto min-[480px]:w-[80vw]"
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
