import React from 'react';

import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';
import AuthorLink from '../Message/AuthorLink';

export default function CommentHeader( props ) {
	const { author, children, className, comment, mini } = props;

	const classes = [
		// Back-compat:
		'Comment-Header',

		'group min-h-10 flex items-center -ml-12 bg-white',

		// Strong child.
		'[&>strong]:grow [&>strong]:leading-[1.2]',

		// Button.
		'[&_button]:mb-0',

		// Mobile (max-width: 600px).
		'max-[600px]:-ml-8 max-[600px]:h-auto max-[600px]:flex-wrap',

		mini && 'Comment-Header--mini ml-0 h-auto flex-wrap',
		className,
	];

	return (
		<header className={ classes.filter( Boolean ).join( ' ' ) }>
			<Avatar
				className={ mini ? (
					'w-[24px]! h-[24px]! -ml-[30px] mr-[6px] py-2 bg-white after:top-2'
				) : (
					'mr-4 max-[600px]:w-[24px]! max-[600px]:h-[24px]! max-[600px]:mr-2 max-[600px]:bg-white'
				) }
				imgClassName={ mini ? (
					'w-[24px]! h-[24px]!'
				) : (
					'max-[600px]:w-[24px]! max-[600px]:h-[24px]!'
				) }
				url={ author ? author.avatar_urls['96'] : '' }
				user={ author }
				size={ mini ? 24 : 32 }
			/>
			<strong>
				{ author ? (
					<AuthorLink user={ author }>{ author.name }</AuthorLink>
				) : comment.author_name }
			</strong>
			<div className="actions-wrap block items-center min-[601px]:flex min-[601px]:min-h-[24px] min-[601px]:[&_.Comment-Actions]:hidden min-[601px]:[&_.Comment-Actions]:group-hover:flex">
				<Link
					className="Comment-date text-hm-medium-grey text-[0.75em] mr-[0.5em] leading-[1.1] hover:border-none hover:underline"
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
