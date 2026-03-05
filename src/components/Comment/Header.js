import React from 'react';

import Avatar from '../Avatar';
import FormattedDate from '../FormattedDate';
import Link from '../Link';
import AuthorLink from '../Message/AuthorLink';

const BASE_CLASSES = [
	// Back-compat:
	'Comment-Header',

	'h-[50px] flex items-center -ml-[30px] bg-white',

	// Avatar child.
	'[&>.Avatar]:-ml-[30px] [&>.Avatar]:mr-5',

	// Strong child.
	'[&>strong]:grow [&>strong]:leading-[1.2]',

	// Actions wrap.
	'[&_.actions-wrap]:block [&_.actions-wrap]:items-center',

	// Comment date link.
	'[&_.Comment-date]:text-hm-medium-grey [&_.Comment-date]:text-[0.75em]',
	'[&_.Comment-date]:mr-[0.5em] [&_.Comment-date]:leading-[1.1]',
	'[&_a.Comment-date:hover]:border-none [&_a.Comment-date:hover]:underline',

	// Button.
	'[&_button]:mb-0',

	// Desktop (min-width: 601px).
	'min-[601px]:[&_.actions-wrap]:flex',
	'min-[601px]:[&_.Comment-Actions]:hidden',
	'min-[601px]:hover:[&_.Comment-Actions]:flex',
	'min-[601px]:[&_.actions-wrap]:min-h-[24px]',
	'min-[601px]:[&_.Dropdown_.btn--small]:min-h-[24px]',
	'min-[601px]:[&_.btn--small]:text-[0.8rem] min-[601px]:[&_.btn--small]:leading-[1.5555]',

	// Mobile (max-width: 600px).
	'max-[600px]:ml-0 max-[600px]:h-auto max-[600px]:flex-wrap',
	'max-[600px]:[&>.Avatar]:!h-[24px] max-[600px]:[&>.Avatar]:!w-[24px]',
	'max-[600px]:[&>.Avatar_img]:!h-[24px] max-[600px]:[&>.Avatar_img]:!w-[24px]',
	'max-[600px]:[&>.Avatar]:-ml-[30px] max-[600px]:[&>.Avatar]:mr-[6px] max-[600px]:[&>.Avatar]:bg-white',
].join( ' ' );

const MINI_CLASSES = [
	// Back-compat:
	'Comment-Header--mini',

	'ml-0 h-auto flex-wrap',
	'[&>.Avatar]:!h-[24px] [&>.Avatar]:!w-[24px]',
	'[&>.Avatar_img]:!h-[24px] [&>.Avatar_img]:!w-[24px]',
	'[&>.Avatar]:-ml-[30px] [&>.Avatar]:mr-[6px] [&>.Avatar]:py-2 [&>.Avatar]:bg-white',
	'[&_.Avatar:after]:top-2',
].join( ' ' );

export default function CommentHeader( props ) {
	const { author, children, comment, mini } = props;

	const classes = [
		BASE_CLASSES,
		mini && MINI_CLASSES,
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
