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
						<FormattedRelative value={ comment.date_gmt + 'Z' } />
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
