import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import FormattedDate from '../FormattedDate';
import AuthorLink from '../Message/AuthorLink';

import './ActivityMention.css';

/*
 * A quiet activity row showing that this post materially supported a delivered
 * Human answer. The server writes it as an email-silent `human_mention`
 * comment; like Slack mentions, it has no avatar, actions, replies, or thread.
 */
export default function HumanMention( { comment } ) {
	const human = comment.human || {};
	const question = human.question_url ? (
		<a
			className="Comment-HumanMention__question"
			href={ human.question_url }
			rel="nofollow noopener noreferrer"
			target="_blank"
		>
			a question
		</a>
	) : 'a question';
	const asker = ( human.asker_username && human.asker_id ) ? (
		<AuthorLink
			user={ {
				id: human.asker_id,
				name: human.asker,
			} }
			withHovercard={ false }
		>
			@{ human.asker_username }
		</AuthorLink>
	) : '@user';

	return (
		<div
			className="Comment-ActivityMention"
			id={ `comment-${ comment.id }` }
		>
			<span className="Comment-ActivityMention__node">
				<span
					aria-hidden="true"
					className="Comment-HumanMention__logo hm-logo hm-logo--tiny hm-logo--red"
				/>
			</span>
			<span className="Comment-ActivityMention__text">
				<Fragment>
					Referenced by <strong>@human</strong> to answer { question } from { asker }
				</Fragment>
			</span>
			<span className="Comment-ActivityMention__date">
				<FormattedDate date={ comment.date_gmt + 'Z' } />
			</span>
		</div>
	);
}

HumanMention.propTypes = {
	comment: PropTypes.shape( {
		id: PropTypes.number,
		type: PropTypes.string,
		date_gmt: PropTypes.string,
		human: PropTypes.shape( {
			question_url: PropTypes.string,
			asker: PropTypes.string,
			asker_username: PropTypes.string,
			asker_id: PropTypes.number,
		} ),
	} ).isRequired,
};
