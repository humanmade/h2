import { withPagedArchive } from '@humanmade/repress';
import React from 'react';
import { connect } from 'react-redux';

import { posts } from '../../types';
import Pagination from '../Pagination';
import PostComponent from '../Post';
import { mapViewModeToProps } from '../Post/List';
import PostLoader from '../Post/Loader';

function UserPosts( props ) {
	const { hasMore, match, user, viewMode } = props;

	if ( props.loading || props.loadingMore ) {
		return (
			<div className="PostsList">
				<PostLoader />
				<PostLoader />
			</div>
		);
	}

	// A failed request (including a page past the end) leaves no posts at all,
	// while a user with nothing published has an empty list.
	if ( ! props.posts || ! props.posts.length ) {
		return (
			<div className="PostsList">
				<p className="py-6 m-0 text-sm text-gray-500">
					{ props.posts ? `${ user.name } hasn’t posted anything yet.` : 'Could not load these posts.' }
				</p>
				<Pagination
					hasNext={ false }
					params={ match.params }
					path={ match.path }
				/>
			</div>
		);
	}

	return (
		<div className="PostsList relative">
			{ props.posts.map( post => (
				<PostComponent
					key={ post.id }
					data={ post }
					viewMode={ viewMode }
				/>
			) ) }
			<Pagination
				hasNext={ hasMore }
				params={ match.params }
				path={ match.path }
			/>
		</div>
	);
}

const ConnectedUserPosts = withPagedArchive(
	posts,
	state => state.posts,
	props => {
		const id = `user/${ props.user.id }`;
		posts.registerArchive( id, {
			author: props.user.id,
		} );
		return id;
	},
	{
		getPage: props => Number( props.match.params.page || 1 ),
	}
)( UserPosts );

export default connect( mapViewModeToProps )( ConnectedUserPosts );
