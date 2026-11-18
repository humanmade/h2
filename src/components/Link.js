import React from 'react';
import { Link as InternalLink, matchPath } from 'react-router-dom';

import { POST_ROUTE } from '../App';

import PostHovercard, { NetworkPostHovercard } from './PostHovercard';
import { isNetworkUrl } from './Super/util';

const DEFAULT_STYLE = 'text-hm-vibrant-blue hover:underline';

/**
 * Check whether a link may be to a post on another site on the network.
 *
 * Only the linked site knows whether it is, as it may use different permalinks.
 * This rules out home pages, which could be a page set as the front page, and
 * WordPress's own files, like uploads.
 *
 * @param {string} url URL to check.
 * @returns {boolean} True if the URL could be to a post on the network.
 */
function isNetworkPostCandidate( url ) {
	if ( ! isNetworkUrl( url ) ) {
		return false;
	}

	const { pathname } = new URL( url );
	return pathname !== '/' && ! pathname.startsWith( '/wp-' );
}

// Forwards the ref so that links can be used as the target of a Hovercard.
export default React.forwardRef( function Link( { children, className, disablePreviews, href, ...props }, ref ) {
	const root = window.H2Data.site.home;

	if ( ! href.startsWith( root ) ) {
		const anchor = (
			<a
				className={ [
					DEFAULT_STYLE,
					className,
				].filter( Boolean ).join( ' ' ) }
				href={ href }
				ref={ ref }
				{ ...props }
			>
				{ children }
			</a>
		);

		// Is this a link to a post on another site on the network?
		if ( ! disablePreviews && isNetworkPostCandidate( href ) ) {
			return (
				<NetworkPostHovercard
					url={ href }
				>
					{ anchor }
				</NetworkPostHovercard>
			);
		}

		return anchor;
	}

	const relativeTo = href.replace( root, '' );

	const link = (
		<InternalLink
			className={ [
				DEFAULT_STYLE,
				className,
			].filter( Boolean ).join( ' ' ) }
			ref={ ref }
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
} );
