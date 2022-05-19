import React from 'react';

import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';
import AuthorLink from '../Message/AuthorLink';

import './Header.css';

export default function CommentHeader( props ) {
	const { author, children, comment, mini } = props;

	const classes = [
		'Comment-Header',
		mini && 'Comment-Header--mini',
	];

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
					<FormattedDate date={ comment.date_gmt + 'Z' } />
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
