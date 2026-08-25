import PropTypes from 'prop-types';
import React from 'react';

import FormattedDate from '../FormattedDate';

import './ActivityMention.css';

/*
 * A quiet activity row showing that this post materially supported a delivered
 * Human answer. The server writes it as an email-silent `human_mention`
 * comment; like Slack mentions, it has no avatar, actions, replies, or thread.
 */
export default function HumanMention( { comment } ) {
	return (
		<div
			className="Comment-ActivityMention"
			id={ `comment-${ comment.id }` }
		>
			<span className="Comment-ActivityMention__node">
				<span
					aria-hidden="true"
					className="Comment-HumanMention__logo hm-logo hm-logo--tiny"
				/>
			</span>
			<span className="Comment-ActivityMention__text">
				Used by Human to answer a question
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
	} ).isRequired,
};
