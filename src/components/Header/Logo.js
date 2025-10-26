import React from 'react';

export default function ( props ) {
	const customLogo = window.H2Data?.site?.logo;

	return (
		<div className="bg-brand py-1.5 h-[45px] w-[45px] flex items-center justify-center min-[601px]:w-[60px] min-[783px]:py-2 min-[783px]:h-[60px]">
			{ customLogo ? (
				<img
					src={ customLogo }
					alt={ window.H2Data?.site?.name || 'Logo' }
					className="max-w-full max-h-full w-auto h-auto object-contain p-1.5"
				/>
			) : (
				<span className="hm-logo hm-logo--tiny hm-logo--white !w-6 !h-6 max-[600px]:!ml-1.5" />
			) }
		</div>
	);
}
