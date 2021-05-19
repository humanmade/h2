import { withArchive, withSingle } from '@humanmade/repress';
import Interweave from 'interweave';
import PropTypes from 'prop-types';
import qs from 'qs';
import React from 'react';
import { FormattedRelative } from 'react-intl';

import { Post as PostShape, User as UserShape } from '../shapes';
import { posts, users } from '../types';
import { decodeEntities } from '../util';

import Avatar from './Avatar';
import Hovercard from './Hovercard';

import './PostHovercard.css';

export const PostCardAuthor = ( { author } ) => (
	author ? (
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
	)
);

export const ConnectedPostCardAuthor = withSingle(
	users,
	state => state.users,
	props => props.id,
	{
		mapDataToProps: data => ( {
			author: data.post,
			loading: data.loading,
		} ),
		mapActionsToProps: () => ( {} ),
	}
)( PostCardAuthor );

export function PostCard( { loading, post, AuthorComponent = ConnectedPostCardAuthor } ) {
	if ( loading ) {
		return (
			<aside className="PostHovercard">
				<p className="PostHovercard__loading">Loading…</p>
			</aside>
		);
	}

	if ( ! post ) {
		return (
			<aside className="PostHovercard">
				<p className="PostHovercard__error">Could not load post.</p>
			</aside>
		);
	}

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
				<AuthorComponent
					id={ post.author }
				/>

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

export const ConnectedPostCard = withArchive(
	posts,
	state => state.posts,
	props => {
		const filters = {
			slug: props.match.params.slug,
		};

		const id = qs.stringify( filters );
		posts.registerArchive( id, filters );
		return id;
	},
	{
		mapDataToProps: data => ( {
			post: data.posts && data.posts.length ? data.posts[0] : null,
			loading: data.loading,
		} ),
		mapActionsToProps: () => ( {} ),
	}
)( PostCard );

export default class PostHovercard extends React.Component {
	render() {
		const { children, match } = this.props;

		const content = () => (
			<ConnectedPostCard
				match={ match }
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
	match: PropTypes.shape( {
		params: PropTypes.shape( {
			slug: PropTypes.string.isRequired,
		} ).isRequired,
	} ).isRequired,
};
