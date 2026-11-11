import React from 'react';

import { Comment } from '../../shapes';
import FormattedDate from '../FormattedDate';

import './ActivityMention.css';

export default function ActivityMention( { comment } ) {
	const { mention } = comment;

	return (
		<div className="Comment-ActivityMention" id={ `comment-${ comment.id }` }>
			{ mention?.icon_url && (
				<span className="Comment-ActivityMention__node">
					<img
						alt={ mention.icon_label || '' }
						className="Comment-ActivityMention__icon"
						src={ mention.icon_url }
						width={ 14 }
						height={ 14 }
					/>
				</span>
			) }
			<span
				className="Comment-ActivityMention__text"
				dangerouslySetInnerHTML={ { __html: comment.content.rendered } }
			/>
			<span className="Comment-ActivityMention__date">
				<FormattedDate date={ comment.date_gmt + 'Z' } />
			</span>
		</div>
	);
}

ActivityMention.propTypes = {
	comment: Comment.isRequired,
};
