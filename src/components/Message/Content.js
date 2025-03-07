import Interweave from 'interweave';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React from 'react';

import { parseList, parseListItem } from '../../embeds/tasklist';
import matchers from '../../matchers';
import Link from '../Link';
import Notification from '../Notification';
import TimeHovercard from '../TimeHovercard';

import SafeEmbed from './SafeEmbed';

import '@humanmade/react-tasklist/css/index.css';
import './Content.css';

const preparseEmoji = window.wp && window.wp.emoji ? memoize( content => window.wp.emoji.parse( content ) ) : content => content;

class ErrorBoundary extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			error: false,
		};
	}

	componentDidCatch( error, info ) {
		this.setState( { error } );
	}

	render() {
		if ( this.state.error ) {
			return (
				<Notification type="error">
					A problem occurred while rendering this content. Please <a href="https://github.com/humanmade/H2/issues/new" taget="_blank">report this as a bug</a>.<br />
					<code>{ this.state.error.toString() }</code>
				</Notification>
			);
		}

		return this.props.children;
	}
}

const transform = ( node, children ) => {
	switch ( node.tagName ) {
		// Trust embeds and iframes, as they have already passed through WP's validation.
		case 'EMBED':
		case 'IFRAME':
			return <SafeEmbed node={ node } />;

		case 'BLOCKQUOTE':
			// Support WordPress embeds.
			if ( node.dataset && node.dataset.secret ) {
				return (
					<blockquote
						data-secret={ node.dataset.secret }
					>
						{ children }
					</blockquote>
				);
			}

			// For regular blockquotes, use built-in handling.
			return;

		case 'TIME':
			return (
				<TimeHovercard
					dateTime={ node.dateTime }
				>
					{ children }
				</TimeHovercard>
			);

		case 'LI':
			return parseListItem( node, children );

		case 'UL':
			return parseList( node, children );

		case 'A': {
			let href = node.href;

			if ( href.startsWith( 'about:blank#' ) ) {
				// Correct relative anchors back to what they should be.
				href = href.replace( 'about:blank#', '#' );
			}

			return (
				<Link
					href={ href }
					rel={ node.rel || undefined }
					target={ node.target || undefined }
				>
					{ children }
				</Link>
			);
		}

		default:
			// Use built-in handling.
			return;
	}
};

export function Content( props ) {
	// Parse emoji early to ensure it doesn't get replaced later by wp-emoji,
	// which breaks React's rendering.
	// https://github.com/humanmade/H2/issues/250
	const html = preparseEmoji( props.html );

	return (
		<div className="PostContent">
			<ErrorBoundary>
				<Interweave
					content={ html }
					matchers={ matchers }
					tagName="fragment"
					transform={ transform }
				/>
			</ErrorBoundary>
		</div>
	);
}

Content.propTypes = {
	html: PropTypes.string.isRequired,
};

export default Content;
