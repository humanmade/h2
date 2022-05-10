import React from 'react';
import { Link as InternalLink, matchPath } from 'react-router-dom';

import { POST_ROUTE } from '../App';
import ImageLink from './ImageLink';

import PostHovercard from './PostHovercard';

export default function Link( { children, disablePreviews, href, ...props } ) {
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

	if ( href.match( /\.(png|jpg|jpeg)$/ ) ) {
		return (
			<ImageLink { ...props } href={ href }>
				{ children }
			</ImageLink>
		);
	}

	const relativeTo = href.replace( /^(?:\/\/|[^/]+)*\//, '/' );

	const link = (
		<InternalLink
			to={ relativeTo }
			{ ...props }
		>
			{ children }
		</InternalLink>
	);

	if ( disablePreviews ) {
		return link;
	}

	// Is this an internal link to a post?
	const args = {
		path: POST_ROUTE,
		exact: true,
	};
	const postMatch = matchPath( relativeTo, args );
	if ( postMatch ) {
		return (
			<PostHovercard
				{ ...props }
				match={ postMatch }
			>
				{ link }
			</PostHovercard>
		);
	}

	// No other preview, just return the link.
	return link;
}
