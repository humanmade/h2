import React from 'react';
import { Link as InternalLink, matchPath } from 'react-router-dom';

import { POST_ROUTE } from '../App';

import PostHovercard from './PostHovercard';

const DEFAULT_STYLE = 'text-hm-vibrant-blue hover:underline';

export default function Link( { children, className, disablePreviews, href, ...props } ) {
	const root = window.H2Data.site.home;

	if ( ! href.startsWith( root ) ) {
		return (
			<a
				className={ [
					DEFAULT_STYLE,
					className,
				].filter( Boolean ).join( ' ' ) }
				href={ href }
				{ ...props }
			>
				{ children }
			</a>
		);
	}

	const relativeTo = href.replace( root, '' );

	const link = (
		<InternalLink
			className={ [
				DEFAULT_STYLE,
				className,
			].filter( Boolean ).join( ' ' ) }
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
