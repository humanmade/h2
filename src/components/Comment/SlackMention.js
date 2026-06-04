import PropTypes from 'prop-types';
import React from 'react';

import FormattedDate from '../FormattedDate';

import './SlackMention.css';

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

	// Build the row text around the (optional) channel element without a
	// Fragment: prefix + channelEl + suffix render as inline span children.
	let prefix = 'Shared in Slack';
	let suffix = '';
	if ( isAuto && channelEl ) {
		prefix = 'Auto-posted to ';
		suffix = ' on Slack';
	} else if ( visibility === 'public' && channelEl ) {
		// Public manual shares are attributed to the sharer when the H2 side
		// resolved one (shared_by); otherwise they're unattributed.
		prefix = slack.shared_by ? `Shared by ${ slack.shared_by } in ` : 'Shared in ';
		suffix = ' on Slack';
	} else if ( visibility === 'private' ) {
		prefix = 'Shared in a private channel on Slack';
	} else if ( visibility === 'im' ) {
		prefix = 'Shared in a DM on Slack';
	} else if ( visibility === 'mpim' ) {
		prefix = 'Shared in a group DM on Slack';
	}

	return (
		<div
			className="Comment-SlackMention"
			id={ `comment-${ comment.id }` }
		>
			<span className="Comment-SlackMention__node">
				<SlackLogo />
			</span>
			<span className="Comment-SlackMention__text">
				{ prefix }{ channelEl }{ suffix }
			</span>
			<span className="Comment-SlackMention__date">
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
		} ),
	} ).isRequired,
};
