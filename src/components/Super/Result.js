import PropTypes from 'prop-types';
import React from 'react';

import { decodeEntities } from '../../util';
import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';

import { isCurrentSite } from './util';

const SNIPPET_CLASSES = [
	'Super-result-snippet',
	'mt-2 text-sm text-black/70 leading-normal',
	'[&_p]:m-0 [&_p+p]:mt-1',
	'[&_mark]:bg-[#fff3a3] [&_mark]:text-black [&_mark]:rounded-xs [&_mark]:px-0.5',
].join( ' ' );

const TITLE_LINK_CLASSES = 'text-black! hover:text-hm-vibrant-blue! [&_mark]:bg-transparent [&_mark]:text-inherit [&_mark]:underline [&_mark]:decoration-hm-vibrant-blue [&_mark]:decoration-2';

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
	const { result } = props;
	const isComment = result.type === 'comment';
	const highlight = result.highlight || {};
	const highlightedTitle = highlight.title && highlight.title[0];
	const snippets = highlight.content;

	// The router can only handle links on the current site.
	const Anchor = isCurrentSite( result.site ) ? Link : 'a';
	const anchorProps = Anchor === Link ? { disablePreviews: true } : {};

	const avatarUrls = ( result.author && result.author.avatar_urls ) || {};
	const avatarUrl = avatarUrls['48'] || avatarUrls['96'] || window.H2Data.site.default_avatar;

	return (
		<li className="Super-result m-0 py-4 first:pt-0">
			<div className="flex items-center gap-2 text-xs text-black/60">
				<span className="inline-block px-2 py-0.5 rounded-full bg-hm-beige text-black/80 font-semibold">
					{ result.site.name }
				</span>
				<span>{ isComment ? 'Comment' : 'Post' }</span>
				<span className="ml-auto">
					<FormattedDate date={ result.date_gmt + 'Z' } />
				</span>
			</div>

			<h4 className="m-0 mt-1 text-lg font-bold leading-snug">
				<Anchor
					{ ...anchorProps }
					className={ TITLE_LINK_CLASSES }
					href={ result.link }
				>
					{ isComment && (
						<span className="font-normal text-black/60">Comment on </span>
					) }
					{ highlightedTitle ? (
						<span dangerouslySetInnerHTML={ { __html: highlightedTitle } } />
					) : (
						decodeEntities( result.title )
					) }
				</Anchor>
			</h4>

			{ result.author && (
				<div className="flex items-center gap-2 mt-1 text-sm text-black/60">
					<Avatar
						size={ 20 }
						url={ avatarUrl }
						withHovercard={ false }
					/>
					<span>{ result.author.name }</span>
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
			) : result.excerpt ? (
				<div
					className={ `${ SNIPPET_CLASSES } line-clamp-3` }
					dangerouslySetInnerHTML={ { __html: result.excerpt } }
				/>
			) : null }
		</li>
	);
}

Result.propTypes = {
	result: PropTypes.shape( {
		id: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
		site: PropTypes.shape( {
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
		} ).isRequired,
		title: PropTypes.string.isRequired,
		excerpt: PropTypes.string,
		link: PropTypes.string.isRequired,
		date_gmt: PropTypes.string.isRequired,
		author: PropTypes.shape( {
			name: PropTypes.string.isRequired,
			avatar_urls: PropTypes.object,
		} ),
		highlight: PropTypes.objectOf( PropTypes.arrayOf( PropTypes.string ) ),
	} ).isRequired,
};
