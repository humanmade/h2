import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Slot } from 'react-slot-fill';

import AuthorLink from './AuthorLink';
import Avatar from '../Avatar';
import Link from '../RelativeLink';
import {
	Category as CategoryShape,
	Post as PostShape,
	User as UserShape,
} from '../../shapes';
import { decodeEntities } from '../../util';

import './Header.css';

export default function MessageHeader( props ) {
	const { author, categories, post } = props;
	const { children, ...fillProps } = props;

	// Scale title down slightly for longer titles.
	const headerStyle = {};
	if ( post.title.rendered.length > 22 ) {
		headerStyle.fontSize = '1.333333333rem';
	}

	return (
		<header className="Message-Header">
			<Avatar
				url={ author ? author.avatar_urls['96'] : '' }
				user={ author }
				size={ 60 }
			/>
			<div className="Message-Header__byline">
				<Link to={ post.link }>
					<h2
						className="Message-Header__title"
						style={ headerStyle }
					>
						{ decodeEntities( post.title.rendered ) }
					</h2>
				</Link>
				<span className="Message-Header__date">
					{ author ? (
						<AuthorLink user={ author }>{ author.name }</AuthorLink>
					) : ''},&nbsp;
					<time
						dateTime={ post.date_gmt + 'Z' }
						title={ post.date_gmt + 'Z' }
					>
						<FormattedRelative value={ post.date_gmt + 'Z' } />
					</time>
				</span>
				{categories.length > 0 &&
					<ul className="Message-Header__categories">
						{ categories.map( category => (
							<li key={ category.id }>
								<Link to={ category.link }>{ category.name }</Link>
							</li>
						) ) }
					</ul>
				}
				{ post.status === 'draft' && (
					<span className="Message-Header__status">
						<span role="img" aria-label="">🔒</span>
						Unpublished
					</span>
				) }
				<Slot name="Post.byline" fillChildProps={ fillProps } />
			</div>
			{ children }
		</header>
	);
}

MessageHeader.propTypes = {
	author: UserShape.isRequired,
	categories: PropTypes.arrayOf( CategoryShape ).isRequired,
	collapsed: PropTypes.bool.isRequired,
	post: PostShape.isRequired,
};
