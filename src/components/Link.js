import React from 'react';
import { Link as InternalLink, matchPath } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { POST_ROUTE } from '../App';

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

	const relativeTo = href.replace( root, '' );

	const LinkComponent = relativeTo.indexOf( '#' ) < 0 ? InternalLink : HashLink;

	const link = (
		<LinkComponent
			to={ relativeTo }
			{ ...props }
		>
			{ children }
		</LinkComponent>
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
