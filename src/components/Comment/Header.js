import React from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from '../Avatar';
import Link from '../Link';
import AuthorLink from '../Message/AuthorLink';

import './Header.css';

export default function CommentHeader( props ) {
	const { author, children, comment, mini } = props;

	const classes = [
		'Comment-Header',
		mini && 'Comment-Header--mini',
	];

	const commentDate = comment.date_gmt + 'Z';
	const hoursSinceComment = Math.floor( ( Date.now() - new Date( commentDate ).getTime() ) / 1000 / 60 / 60 );

	return (
		<header className={ classes.filter( Boolean ).join( ' ' ) }>
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
				<Link
					className="Comment-date"
					href={ comment.link }
				>
					<time
						dateTime={ comment.date_gmt + 'Z' }
						title={ comment.date_gmt + 'Z' }
					>
						{ hoursSinceComment < 24 ? (
							<FormattedRelative value={ commentDate } />
						) : (
							// Absolute date if published earlier than 1 day ago.
							new Date( commentDate ).toLocaleDateString()
						) }
					</time>
				</Link>

				{ children }
			</div>
		</header>
	);
}

CommentHeader.defaultProps = {
	mini: false,
	withAvatar: true,
};
