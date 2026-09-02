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
	const botAvatarUrls = comment.author_avatar_urls || {};
	const botAvatar = botAvatarUrls['24'] || botAvatarUrls['48'] || botAvatarUrls['96'];
	const bot = comment.author ? (
		<AuthorLink
			user={ {
				id: comment.author,
				name: botName,
			} }
			withHovercard={ false }
		>
			{ botName }
		</AuthorLink>
	) : botName;
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
	) : '@user';

	return (
		<div
			className="Comment-ActivityMention"
			id={ `comment-${ comment.id }` }
		>
			<span className="Comment-ActivityMention__node">
				{ botAvatar ? (
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
				<Fragment>
					Referenced by <strong>{ bot }</strong> to answer { question } from { asker }
				</Fragment>
			</span>
			<span className="Comment-ActivityMention__date">
				<FormattedDate date={ comment.date_gmt + 'Z' } />
			</span>
		</div>
	);
}

const activityShape = PropTypes.shape( {
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
