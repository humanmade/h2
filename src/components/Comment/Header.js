import React from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from '../Avatar';
import AuthorLink from '../Message/AuthorLink';

import './Header.css';

export default function CommentHeader( props ) {
	const { author, children, comment, post } = props;

	return (
		<header className="Comment-Header">
			<Avatar
				url={ author ? author.avatar_urls['96'] : '' }
				user={ author }
				size={ 40 }
			/>
			<strong>
				{ author ? (
					<AuthorLink user={ author }>{ author.name }</AuthorLink>
				) : comment.author_name }
			</strong>
			<div className="actions-wrap">
				<a
					className="Comment-date"
					href={ `${ post.link }#comment-${ comment.id }` }
				>
					<time
						dateTime={ comment.date_gmt + 'Z' }
						title={ comment.date_gmt + 'Z' }
					>
						<FormattedRelative value={ comment.date_gmt + 'Z' } />
					</time>
				</a>

				{ children }
			</div>
		</header>
	);
}

CommentHeader.defaultProps = {
	withAvatar: true,
};
