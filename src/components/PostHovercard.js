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

export const PostCardAuthor = ( { author } ) => (
	author ? (
		<React.Fragment>
			<Avatar
				className="shrink-0"
				url={ author.avatar_urls['96'] }
				size={ 20 }
				withHovercard={ false }
			/>

			<span className="font-medium text-hm-dark-grey">
				{ author.name }
			</span>

			{ ' · ' }
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

const ASIDE_CLASSES = 'text-sm';
const DESCRIPTION_CLASSES = 'text-sm leading-relaxed text-gray-600 line-clamp-4 [&_p]:m-0 [&_p+p]:mt-2';
const META_CLASSES = 'flex items-center gap-1.5 mt-3 pt-3 border-t border-hm-beige text-xs leading-5 text-gray-500';

export function PostCard( { loading, post, AuthorComponent = ConnectedPostCardAuthor } ) {
	if ( loading ) {
		return (
			<aside className={ ASIDE_CLASSES }>
				<p className="m-0 italic">Loading…</p>
			</aside>
		);
	}

	if ( ! post ) {
		return (
			<aside className={ ASIDE_CLASSES }>
				<p className="m-0 italic">Could not load post.</p>
			</aside>
		);
	}

	return (
		<aside className={ ASIDE_CLASSES }>
			<h3 className="text-sm font-semibold leading-snug normal-case m-0 mb-2 text-hm-dark-grey">
				{ decodeEntities( post.title.rendered ) }
			</h3>

			<div className={ DESCRIPTION_CLASSES }>
				<Interweave
					content={ post.excerpt.rendered }
					tagName="fragment"
				/>
			</div>

			<div className={ META_CLASSES }>
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
	post: PostShape,
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
				width={ 360 }
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
