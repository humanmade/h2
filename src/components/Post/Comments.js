import { withArchive } from '@humanmade/repress';
import React from 'react';

import CommentsList from '../../components/CommentsList';
import { comments } from '../../types';

const PostComments = props => {
	if ( props.isLoading ) {
		return null;
	}
	if ( ! props.posts ) {
		return null;
	}

	const topLevel = props.posts.filter( comment => comment.parent === 0 );
	const onDidCreateComment = () => {
		// Reload comments.
		props.onLoad();

		// And pass up.
		props.onDidCreateComment();
	};

	return <CommentsList
		allComments={ props.posts }
		comments={ topLevel }
		post={ props.post }
		onComment={ props.onComment }
		onDidCreateComment={ onDidCreateComment }
	>
		{ props.children }
	</CommentsList>;
};

export default withArchive(
	comments,
	state => state.comments,
	props => {
		const { post } = props;

		comments.registerArchive( post.id, { post: post.id } );
		return post.id;
	},
)( PostComments );
