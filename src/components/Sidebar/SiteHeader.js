import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteHeader( { children } ) {
	return (
		<div className="px-4 py-6 bg-hm-beige flex items-center justify-between gap-2">
			<h2 className="text-xl font-bold m-0">
				<Link className="block hover:underline" to="/">
					{ window.H2Data.site.name }
				</Link>
			</h2>
			{ children }
		</div>
	);
}
