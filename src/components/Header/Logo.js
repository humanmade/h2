import React from 'react';

import './Logo.css';

export default function ( props ) {
	const customLogo = window.H2Data?.site?.logo;

	return (
		<div className="Logo">
			{ customLogo ? (
				<img
					src={ customLogo }
					alt={ window.H2Data?.site?.name || 'Logo' }
					className="Logo__image"
				/>
			) : (
				<span className="hm-logo hm-logo--tiny hm-logo--white" />
			) }
		</div>
	);
}
