import React from 'react';
import { Link as InternalLink } from 'react-router-dom';

export default function Link( { children, href, ...props } ) {
	const root = window.H2Data.site.home;

	if ( ! href.startsWith( root ) ) {
		return (
			<a
				href={ href }
				{ ...props }
			>
				{ children }
			</a>
		);
	}

	const relativeTo = href.replace( /^(?:\/\/|[^/]+)*\//, '/' );

	return (
		<InternalLink
			to={ relativeTo }
			{ ...props }
		>
			{ children }
		</InternalLink>
	);
}
