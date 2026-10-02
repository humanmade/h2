import PropTypes from 'prop-types';
import React from 'react';

import { decodeEntities } from '../../util';
import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';

import { getPlainText, isCurrentSite } from './util';

const SNIPPET_CLASSES = [
	'Super-result-snippet',
	'mt-2 text-sm text-black/70 leading-normal',
	'[&_p]:m-0 [&_p+p]:mt-1',
	'[&_mark]:bg-[#fff3a3] [&_mark]:text-black [&_mark]:rounded-xs [&_mark]:px-0.5',
].join( ' ' );

const TITLE_LINK_CLASSES = 'text-black! hover:text-hm-vibrant-blue! [&_mark]:bg-transparent [&_mark]:text-inherit [&_mark]:underline [&_mark]:decoration-hm-vibrant-blue [&_mark]:decoration-2';

/**
 * Get the details to show for a post or comment.
 *
 * Posts and comments use the shapes of their regular REST API endpoints, with
 * related objects embedded.
 *
 * @param {string} type Type of result, `post` or `comment`.
 * @param {object} object Post or comment from the search API.
 * @returns {object} Title, author and fallback excerpt for the result.
 */
function getDetails( type, object ) {
	const embedded = object._embedded || {};
	const author = embedded.author && embedded.author[0];

	if ( type === 'comment' ) {
		const post = embedded.up && embedded.up[0];

		return {
			authorName: object.author_name,
			avatarUrls: object.author_avatar_urls,
			// Comments have no excerpt, so fall back to the text of the comment.
			excerptText: getPlainText( object.content.rendered ),
			title: post ? post.title.rendered : '',
		};
	}

	return {
		authorName: author && author.name,
		avatarUrls: author && author.avatar_urls,
		excerptHtml: object.excerpt.rendered,
		title: object.title.rendered,
	};
}

/**
 * A single network search result.
 *
 * Results link to their own site; only results on the current site are routed
 * within the app.
 *
 * @param {object} props Props, with the `result` from the search API.
 * @returns {React.ReactNode} List item for the result.
 */
export default function Result( props ) {
	const { highlight = {}, result: object, site, type } = props.result;
	const isComment = type === 'comment';
	const highlightedTitle = highlight.title && highlight.title[0];
	const snippets = highlight.content;
	const details = getDetails( type, object );
	const { authorName, excerptHtml, excerptText, title } = details;
	const avatarUrls = details.avatarUrls || {};
	const avatarUrl = avatarUrls['48'] || avatarUrls['96'] || window.H2Data.site.default_avatar;

	// The router can only handle links on the current site.
	const Anchor = isCurrentSite( site ) ? Link : 'a';
	const anchorProps = Anchor === Link ? { disablePreviews: true } : {};

	return (
		<li className="Super-result m-0 py-4 first:pt-0">
			<div className="flex items-center gap-2 text-xs text-black/60">
				<span className="inline-block px-2 py-0.5 rounded-full bg-hm-beige text-black/80 font-semibold">
					{ site.name }
				</span>
				<span>{ isComment ? 'Comment' : 'Post' }</span>
				<span className="ml-auto">
					<FormattedDate date={ object.date_gmt + 'Z' } />
				</span>
			</div>

			<h4 className="m-0 mt-1 text-lg font-bold leading-snug">
				<Anchor
					{ ...anchorProps }
					className={ TITLE_LINK_CLASSES }
					href={ object.link }
				>
					{ isComment && (
						<span className="font-normal text-black/60">Comment on </span>
					) }
					{ highlightedTitle ? (
						<span dangerouslySetInnerHTML={ { __html: highlightedTitle } } />
					) : (
						decodeEntities( title )
					) }
				</Anchor>
			</h4>

			{ authorName && (
				<div className="flex items-center gap-2 mt-1 text-sm text-black/60">
					<Avatar
						size={ 20 }
						url={ avatarUrl }
						withHovercard={ false }
					/>
					<span>{ authorName }</span>
				</div>
			) }

			{ snippets && snippets.length ? (
				<div className={ SNIPPET_CLASSES }>
					{ snippets.map( ( snippet, index ) => (
						<p
							key={ index }
							dangerouslySetInnerHTML={ { __html: `…${ snippet }…` } }
						/>
					) ) }
				</div>
			) : excerptHtml ? (
				<div
					className={ `${ SNIPPET_CLASSES } line-clamp-3` }
					dangerouslySetInnerHTML={ { __html: excerptHtml } }
				/>
			) : excerptText ? (
				<div className={ `${ SNIPPET_CLASSES } line-clamp-3` }>
					{ excerptText }
				</div>
			) : null }
		</li>
	);
}

const Rendered = PropTypes.shape( {
	rendered: PropTypes.string.isRequired,
} );

Result.propTypes = {
	result: PropTypes.shape( {
		type: PropTypes.string.isRequired,
		site: PropTypes.shape( {
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
		} ).isRequired,
		highlight: PropTypes.objectOf( PropTypes.arrayOf( PropTypes.string ) ),
		// Post or comment, in the shape of its regular REST API endpoint.
		result: PropTypes.shape( {
			id: PropTypes.number.isRequired,
			date_gmt: PropTypes.string.isRequired,
			link: PropTypes.string.isRequired,
			title: Rendered,
			excerpt: Rendered,
			content: Rendered,
			author_name: PropTypes.string,
			author_avatar_urls: PropTypes.object,
			_embedded: PropTypes.object,
		} ).isRequired,
	} ).isRequired,
};
