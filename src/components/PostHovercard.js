import { withSingle } from '@humanmade/repress';
import Interweave from 'interweave';
import React from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from './Avatar';
import Hovercard from './Hovercard';
import { Post as PostShape, User as UserShape } from '../shapes';
import { users } from '../types';
import { decodeEntities } from '../util';

import './PostHovercard.css';

export function PostCard( { author, post } ) {
	return (
		<aside className="PostHovercard">
			<h3>{ decodeEntities( post.title.rendered ) }</h3>

			<div className="PostHovercard__description">
				<Interweave
					content={ post.excerpt.rendered }
					tagName="fragment"
				/>
			</div>

			<div className="PostHovercard__meta">
				{ author ? (
					<React.Fragment>
						<Avatar
							url={ author.avatar_urls['96'] }
							size={ 24 }
							withHovercard={ false }
						/>

						<span className="PostHovercard__author">
							{ author.name }
						</span>

						{ ' posted ' }
					</React.Fragment>
				) : (
					'Posted '
				) }

				<time
					dateTime={ post.date_gmt + 'Z' }
					title={ post.date_gmt + 'Z' }
				>
					<FormattedRelative value={ post.date_gmt + 'Z' } />
				</time>
			</div>
		</aside>
	);
}

PostCard.propTypes = {
	author: UserShape,
	post: PostShape.isRequired,
};

export const PostCardWithAuthor = withSingle(
	users,
	state => state.users,
	props => props.post.author,
	{
		mapDataToProps: data => ( {
			author: data.post,
			loadingAuthor: data.loading,
		} ),
		mapActionsToProps: () => ( {} ),
	}
)( PostCard )

export default class PostHovercard extends React.Component {
	render() {
		const { children, post } = this.props;

		const content = () => (
			<PostCardWithAuthor
				post={ post }
			/>
		);

		return (
			<Hovercard
				cardContent={ content }
			>
				{ children }
			</Hovercard>
		);
	}
}

PostHovercard.propTypes = {
	post: PostShape.isRequired,
};
