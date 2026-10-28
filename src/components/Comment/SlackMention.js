import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import FormattedDate from '../FormattedDate';
import AuthorLink from '../Message/AuthorLink';

import './ActivityMention.css';

/*
 * A de-emphasised marker in the comment stream noting that the post was
 * shared into a Slack discussion. Written by the Human bot as a
 * `slack_mention` comment; rendered as a quiet, single-line row rather than a
 * full comment — no avatar, actions, replies, or threading. The Slack glyph
 * sits on the thread's vertical line as a node so the line is not broken.
 */

function SlackLogo() {
	return (
		<svg
			aria-hidden="true"
			className="Comment-SlackMention__logo"
			height="14"
			viewBox="0 0 122.8 122.8"
			width="14"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
			<path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
			<path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
			<path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
		</svg>
	);
}

export default function SlackMention( { comment } ) {
	const slack = comment.slack || {};
	const isAuto = slack.source === 'auto';
	// Only public channels are named; private channels, DMs, and group DMs are
	// anonymised so an org-readable post never discloses where it was shared.
	// Fail closed to 'unknown' (never infer 'public' from a channel name).
	const visibility = slack.visibility || 'unknown';

	const channelName = slack.channel_name
		? `#${ slack.channel_name.replace( /^#/, '' ) }`
		: '';

	// The channel is named only when public — gating on visibility (not source
	// or mere name-presence) keeps it fail-closed and consistent with the
	// server. `isAuto` only chooses the wording below. An auto marker that
	// names its channel always has visibility 'public', so this still names it.
	const namesChannel = channelName && visibility === 'public';

	// The named channel element (linked when we have a permalink). Null for
	// anonymised contexts.
	const channelEl = namesChannel
		? ( slack.permalink ? (
			<a
				className="Comment-SlackMention__channel"
				href={ slack.permalink }
				rel="nofollow noopener noreferrer"
				target="_blank"
			>
				{ channelName }
			</a>
		) : (
			<span className="Comment-SlackMention__channel">{ channelName }</span>
		) )
		: null;

	// Public manual shares are attributed to the sharer as a linked @username
	// (opening their H2 profile) when the H2 side resolved one.
	const sharer = {
		id: slack.shared_by_id,
		name: slack.shared_by,
	};
	const authorEl = ( slack.shared_by_username && slack.shared_by_id ) ? (
		<AuthorLink user={ sharer } withHovercard={ false }>
			@{ slack.shared_by_username }
		</AuthorLink>
	) : null;

	// Build the row text, interleaving the (optional) sharer and channel links.
	let body;
	if ( isAuto && channelEl ) {
		body = <Fragment>Auto-posted to { channelEl } on Slack</Fragment>;
	} else if ( visibility === 'public' && channelEl ) {
		body = authorEl
			? <Fragment>Shared by { authorEl } in { channelEl } on Slack</Fragment>
			: <Fragment>Shared in { channelEl } on Slack</Fragment>;
	} else if ( visibility === 'private' ) {
		body = 'Shared in a private channel on Slack';
	} else if ( visibility === 'im' ) {
		body = 'Shared in a DM on Slack';
	} else if ( visibility === 'mpim' ) {
		body = 'Shared in a group DM on Slack';
	} else {
		body = 'Shared in Slack';
	}

	return (
		<div
			className="Comment-ActivityMention"
			id={ `comment-${ comment.id }` }
		>
			<span className="Comment-ActivityMention__node">
				<SlackLogo />
			</span>
			<span className="Comment-ActivityMention__text">
				{ body }
			</span>
			<span className="Comment-ActivityMention__date">
				<FormattedDate date={ comment.date_gmt + 'Z' } />
			</span>
		</div>
	);
}

SlackMention.propTypes = {
	comment: PropTypes.shape( {
		id: PropTypes.number,
		type: PropTypes.string,
		date_gmt: PropTypes.string,
		slack: PropTypes.shape( {
			channel_name: PropTypes.string,
			permalink: PropTypes.string,
			source: PropTypes.string,
			visibility: PropTypes.string,
			shared_by: PropTypes.string,
			shared_by_username: PropTypes.string,
			shared_by_id: PropTypes.number,
		} ),
	} ).isRequired,
};
