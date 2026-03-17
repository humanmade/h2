import React from 'react';

import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';
import AuthorLink from '../Message/AuthorLink';

export default function CommentHeader( props ) {
	const { author, children, comment, mini } = props;

	const classes = [
		// Back-compat:
		'Comment-Header',

		'group h-[50px] flex items-center -ml-[30px] bg-white',

		// Strong child.
		'[&>strong]:grow [&>strong]:leading-[1.2]',

		// Button.
		'[&_button]:mb-0',

		// Desktop (min-width: 601px).
		'min-[601px]:[&_.Dropdown_.btn--small]:min-h-[24px]',
		'min-[601px]:[&_.btn--small]:text-[0.8rem] min-[601px]:[&_.btn--small]:leading-[1.5555]',

		// Mobile (max-width: 600px).
		'max-[600px]:ml-0 max-[600px]:h-auto max-[600px]:flex-wrap',

		mini && 'Comment-Header--mini ml-0 h-auto flex-wrap',
	];

	return (
		<header className={ classes.filter( Boolean ).join( ' ' ) }>
			<Avatar
				className={ mini ? (
					'!w-[24px] !h-[24px] -ml-[30px] mr-[6px] py-2 bg-white after:top-2'
				) : (
					'-ml-[30px] mr-5 max-[600px]:!w-[24px] max-[600px]:!h-[24px] max-[600px]:mr-[6px] max-[600px]:bg-white'
				) }
				imgClassName={ mini ? (
					'!w-[24px] !h-[24px]'
				) : (
					'max-[600px]:!w-[24px] max-[600px]:!h-[24px]'
				) }
				url={ author ? author.avatar_urls['96'] : '' }
				user={ author }
				size={ 40 }
			/>
			<strong>
				{ author ? (
					<AuthorLink user={ author }>{ author.name }</AuthorLink>
				) : comment.author_name }
			</strong>
			<div className="actions-wrap block items-center min-[601px]:flex min-[601px]:min-h-[24px] min-[601px]:[&_.Comment-Actions]:hidden min-[601px]:group-hover:[&_.Comment-Actions]:flex">
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
