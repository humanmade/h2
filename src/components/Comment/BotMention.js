import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import FormattedDate from '../FormattedDate';
import AuthorLink from '../Message/AuthorLink';

import './ActivityMention.css';

/*
 * A quiet activity row showing that this post materially supported a delivered
 * bot answer. The bot identity comes from the comment author rather than from
 * a hard-coded integration name.
 */
export default function BotMention( { comment } ) {
	const activity = comment.human || {};
	const botName = comment.author_name || 'a bot';
	const botUsername = comment.author_name ? comment.author_name.replace( /^@/, '' ) : '';
	const botLabel = botUsername ? `@${ botUsername }` : botName;
	const botAvatarUrls = comment.author_avatar_urls || {};
	const botAvatar = botAvatarUrls['24'] || botAvatarUrls['48'] || botAvatarUrls['96'];
	const bot = ( comment.author && botUsername ) ? (
		<AuthorLink
			user={ {
				id: comment.author,
				name: botName,
			} }
			withHovercard={ false }
		>
			{ botLabel }
		</AuthorLink>
	) : botLabel;
	const meeting = activity.meeting;
	const meetingBot = meeting?.profile_url ? <a href={ meeting.profile_url }>{ botLabel }</a> : botLabel;
	const question = activity.question_url ? (
		<a
			className="Comment-BotMention__question"
			href={ activity.question_url }
			rel="nofollow noopener noreferrer"
			target="_blank"
		>
			a question
		</a>
	) : 'a question';
	const asker = ( activity.asker_username && activity.asker_id ) ? (
		<AuthorLink
			user={ {
				id: activity.asker_id,
				name: activity.asker,
			} }
			withHovercard={ false }
		>
			@{ activity.asker_username }
		</AuthorLink>
	) : null;

	return (
		<div
			className="Comment-ActivityMention"
			id={ `comment-${ comment.id }` }
		>
			<span className="Comment-ActivityMention__node">
				{ meeting?.icon_url ? (
					<img
						alt={ meeting.icon_label || '' }
						className="Comment-BotMention__meetingIcon"
						src={ meeting.icon_url }
						width={ 14 }
						height={ 14 }
					/>
				) : botAvatar ? (
					<img
						alt=""
						className="Comment-BotMention__logo"
						src={ botAvatar }
					/>
				) : (
					<span
						aria-hidden="true"
						className="Comment-BotMention__logo Comment-BotMention__logo--fallback"
					>
						{ botName.charAt( 0 ).toUpperCase() }
					</span>
				) }
			</span>
			<span className="Comment-ActivityMention__text">
				{ meeting ? (
					<>
						Referenced by { meetingBot }{ ' ' }
						{ meeting.url ? (
							<>
								in the { meeting.provider === 'slack_huddle' && 'huddle ' }
								<a href={ meeting.url }>{ meeting.kind }</a> for <strong>{ meeting.title }</strong>{ ' ' }
								in <strong>#{ meeting.channel }</strong>
							</>
						) : `in a meeting ${ meeting.kind }` }
					</>
				) : (
					<Fragment>
						Referenced by { bot }
						{ ( activity.question_url || asker ) && (
							<Fragment> to answer { question }</Fragment>
						) }
						{ asker && <Fragment> from { asker }</Fragment> }
					</Fragment>
				) }
			</span>
			<span className="Comment-ActivityMention__date">
				<FormattedDate date={ comment.date_gmt + 'Z' } />
			</span>
		</div>
	);
}

const activityShape = PropTypes.shape( {
	meeting: PropTypes.shape( {
		kind: PropTypes.oneOf( [ 'briefing', 'recap' ] ).isRequired,
		title: PropTypes.string,
		channel: PropTypes.string,
		url: PropTypes.string,
		profile_url: PropTypes.string,
		provider: PropTypes.string,
		icon_url: PropTypes.string,
		icon_label: PropTypes.string,
	} ),
	question_url: PropTypes.string,
	asker: PropTypes.string,
	asker_username: PropTypes.string,
	asker_id: PropTypes.number,
} );

BotMention.propTypes = {
	comment: PropTypes.shape( {
		author: PropTypes.number,
		author_avatar_urls: PropTypes.objectOf( PropTypes.string ),
		author_name: PropTypes.string,
		date_gmt: PropTypes.string,
		human: activityShape,
		id: PropTypes.number,
		type: PropTypes.string,
	} ).isRequired,
};
