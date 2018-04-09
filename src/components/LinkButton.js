import React from 'react';

import './LinkButton.css';

export default function LinkButton( props ) {
	return (
		<button
			type="button"
			{ ...props }
			className={ `LinkButton ${ props.className || '' }` }
		/>
	);
}
