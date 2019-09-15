import Interweave from 'interweave';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import SafeEmbed from './SafeEmbed';
import Notification from '../Notification';
import matchers from '../../matchers';

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
					A problem occurred while rendering this content. Please report this as a bug.<br />
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

		default:
			// Use built-in handling.
			return;
	}
};

export function Content( props ) {
	if ( ! props.useInterweave ) {
		return (
			<div
				className="PostContent"
				dangerouslySetInnerHTML={ { __html: props.html } }
			/>
		);
	}

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

const mapStateToProps = state => ( {
	useInterweave: state.features.use_interweave,
} );

export default connect( mapStateToProps )( Content );
