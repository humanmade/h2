import { withArchive, withSingle } from '@humanmade/repress';
import Interweave from 'interweave';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedRelative } from 'react-intl';

import { User as UserShape } from '../shapes';
import { posts, users } from '../types';
import { decodeEntities } from '../util';

import Avatar from './Avatar';
import Hovercard from './Hovercard';
import { isCurrentSite } from './Super/util';

export const PostCardAuthor = ( { author } ) => (
	author ? (
		<React.Fragment>
			<Avatar
				className="shrink-0"
				url={ author.avatar_urls['96'] }
				size={ 20 }
				withHovercard={ false }
			/>

			<span className="font-medium text-hm-dark-grey">
				{ author.name }
			</span>

			{ ' · ' }
		</React.Fragment>
	) : (
		'Posted '
	)
);

export const ConnectedPostCardAuthor = withSingle(
	users,
	state => state.users,
	props => props.id,
	{
		mapDataToProps: data => ( {
			author: data.post,
			loading: data.loading,
		} ),
		mapActionsToProps: () => ( {} ),
	}
)( PostCardAuthor );

const ASIDE_CLASSES = 'text-sm';
const DESCRIPTION_CLASSES = 'text-sm leading-relaxed text-gray-600 line-clamp-4 [&_p]:m-0 [&_p+p]:mt-2';
const META_CLASSES = 'flex items-center gap-1.5 mt-3 pt-3 border-t border-hm-beige text-xs leading-5 text-gray-500';
const SITE_CLASSES = 'inline-block mb-2 px-2 py-0.5 rounded-full bg-hm-beige text-xs font-semibold text-black/80';

export function PostCard( { loading, post, site, AuthorComponent = ConnectedPostCardAuthor } ) {
	if ( loading ) {
		return (
			<aside className={ ASIDE_CLASSES }>
				<p className="m-0 italic">Loading…</p>
			</aside>
		);
	}

	if ( ! post ) {
		return (
			<aside className={ ASIDE_CLASSES }>
				<p className="m-0 italic">Could not load post.</p>
			</aside>
		);
	}

	return (
		<aside className={ ASIDE_CLASSES }>
			{ site && ! isCurrentSite( site ) && (
				<span className={ SITE_CLASSES }>
					{ decodeEntities( site.name ) }
				</span>
			) }

			<h3 className="text-sm font-semibold leading-snug normal-case m-0 mb-2 text-hm-dark-grey">
				{ decodeEntities( post.title.rendered ) }
			</h3>

			{ /* Some post types, like attachments, have no excerpt. */ }
			{ post.excerpt && (
				<div className={ DESCRIPTION_CLASSES }>
					<Interweave
						content={ post.excerpt.rendered }
						tagName="fragment"
					/>
				</div>
			) }

			<div className={ META_CLASSES }>
				<AuthorComponent
					id={ post.author }
				/>

				<time
					dateTime={ post.date_gmt + 'Z' }
					title={ post.date_gmt + 'Z' }
				>
					<FormattedRelative value={ post.date_gmt + 'Z' } />
				</time>
			</div>
		</aside>
	);
}

const Rendered = PropTypes.shape( {
	rendered: PropTypes.string.isRequired,
} );

PostCard.propTypes = {
	author: UserShape,
	// Only the fields used here, as posts from other sites have no `content`,
	// and may be of a type without an author or excerpt.
	post: PropTypes.shape( {
		author: PropTypes.number,
		date_gmt: PropTypes.string.isRequired,
		excerpt: Rendered,
		title: Rendered.isRequired,
	} ),
	site: PropTypes.shape( {
		name: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
	} ),
};

export const ConnectedPostCard = withArchive(
	posts,
	state => state.posts,
	props => {
		const filters = {
			slug: props.match.params.slug,
		};

		const id = qs.stringify( filters );
		posts.registerArchive( id, filters );
		return id;
	},
	{
		mapDataToProps: data => ( {
			post: data.posts && data.posts.length ? data.posts[0] : null,
			loading: data.loading,
		} ),
		mapActionsToProps: () => ( {} ),
	}
)( PostCard );

export default class PostHovercard extends React.Component {
	render() {
		const { children, match } = this.props;

		const content = () => (
			<ConnectedPostCard
				match={ match }
			/>
		);

		return (
			<Hovercard
				cardContent={ content }
				width={ 360 }
			>
				{ children }
			</Hovercard>
		);
	}
}

PostHovercard.propTypes = {
	match: PropTypes.shape( {
		params: PropTypes.shape( {
			slug: PropTypes.string.isRequired,
		} ).isRequired,
	} ).isRequired,
};

/**
 * Post fields to load from other sites.
 *
 * The author link is needed for the author to be embedded.
 */
const NETWORK_POST_FIELDS = 'author,date_gmt,excerpt,title,_links.author,_embedded';

/**
 * Requests to other sites, keyed by URL.
 *
 * Kept for the lifetime of the page, so that each is only made once.
 */
const networkRequests = {};

/**
 * Fetch JSON from the REST API of another site on the network.
 *
 * Login cookies are shared across the network, so these get the user past the
 * login wall of private sites. No nonce is sent, as the custom header would
 * need a CORS preflight, which login-protected sites don't allow for it.
 * Without a nonce, the REST API treats the request as logged out, so only
 * published content is returned.
 *
 * @param {string} url URL to fetch.
 * @returns {Promise<*>} Resolves to the decoded response.
 */
function fetchFromNetwork( url ) {
	if ( ! networkRequests[ url ] ) {
		networkRequests[ url ] = window.fetch( url, { credentials: 'include' } ).then( response => {
			if ( ! response.ok ) {
				throw new Error( `Request to ${ url } failed with status ${ response.status }.` );
			}

			return response.json();
		} );
	}

	return networkRequests[ url ];
}

/**
 * Load a post from another site on the network, from that site's REST API.
 *
 * The site finds the post from its URL itself (with the H2 Network plugin), so
 * this works whatever its permalinks look like.
 *
 * @param {string} url URL of the post.
 * @returns {Promise<object>} Resolves to the `post`, with its author embedded, and the `site` it belongs to, which is null if unavailable.
 */
export function loadNetworkPost( url ) {
	const target = new URL( url );

	// The fragment doesn't change the post, so drop it to share requests
	// between links to different comments.
	target.hash = '';

	const api = `${ target.origin }/wp-json/`;
	const query = qs.stringify( {
		url: target.href,
		_embed: 'author',
		_fields: NETWORK_POST_FIELDS,
	} );
	const postRequest = fetchFromNetwork( `${ api }h2/v1/lookup?${ query }` ).then( post => {
		// Some post types have no title, which the card needs.
		if ( ! post.title ) {
			throw new Error( `The post at ${ url } has no title.` );
		}

		return post;
	} );

	// The site label is optional, so the card can show without it.
	const siteRequest = fetchFromNetwork( `${ api }?_fields=name,home` )
		.then( data => ( {
			name: data.name,
			url: data.home,
		} ) )
		.catch( () => null );

	return Promise.all( [ postRequest, siteRequest ] ).then( ( [ post, site ] ) => ( {
		post,
		site,
	} ) );
}

/**
 * Card for a post on another site.
 *
 * The author is embedded in the post, as the store only holds users from the
 * current site.
 *
 * @param {object} props Component props.
 * @param {object} props.post Post data, from `loadNetworkPost()`.
 * @param {?object} props.site Site the post belongs to.
 * @returns {React.ReactNode} Post card.
 */
export function NetworkPostCard( { post, site } ) {
	const embedded = post._embedded || {};
	const author = embedded.author ? embedded.author[0] : null;

	return (
		<PostCard
			AuthorComponent={ () => (
				<PostCardAuthor
					// The embed is an error object if the author can't be read.
					author={ author && author.avatar_urls ? author : null }
				/>
			) }
			post={ post }
			site={ site }
		/>
	);
}

NetworkPostCard.propTypes = {
	post: PropTypes.object.isRequired,
	site: PropTypes.object,
};

/**
 * Hovercard for a link to another site on the network.
 *
 * The link may not be to a post at all, as only the linked site knows that.
 * So the post is loaded as soon as the link is hovered, and the card is only
 * shown once a post is found.
 *
 * @param {object} props Component props.
 * @param {React.ReactElement} props.children Link to show the hovercard for.
 * @param {string} props.url URL of the link.
 * @returns {React.ReactNode} Link with a hovercard.
 */
export function NetworkPostHovercard( { children, url } ) {
	const [ result, setResult ] = useState( null );
	const mounted = useRef( true );
	useEffect( () => () => {
		mounted.current = false;
	}, [] );

	const link = React.Children.only( children );
	const onMouseEnter = event => {
		if ( link.props.onMouseEnter ) {
			link.props.onMouseEnter( event );
		}

		// Requests are cached, so this only loads the post once.
		loadNetworkPost( url ).then(
			data => mounted.current && setResult( {
				...data,
				url,
			} ),
			() => mounted.current && setResult( {
				post: null,
				url,
			} )
		);
	};

	const found = result && result.url === url && result.post ? result : null;
	const content = () => found && (
		<NetworkPostCard
			post={ found.post }
			site={ found.site }
		/>
	);

	return (
		<Hovercard
			cardContent={ content }
			disabled={ ! found }
			width={ 360 }
		>
			{ React.cloneElement( link, { onMouseEnter } ) }
		</Hovercard>
	);
}

NetworkPostHovercard.propTypes = {
	children: PropTypes.element.isRequired,
	url: PropTypes.string.isRequired,
};
