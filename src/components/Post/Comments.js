import { withArchive } from '@humanmade/repress';
import React from 'react';

import CommentsList from '../CommentsList';
import WriteComment from '../Message/WriteComment';
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

	return (
		<CommentsList
			allComments={ props.posts }
			comments={ topLevel }
			post={ props.post }
			onDidCreateComment={ onDidCreateComment }
		>
			{ props.showingReply && (
				<WriteComment
					parentPost={ props.post }
					onCancel={ props.onCancelReply }
					onDidCreateComment={ onDidCreateComment }
				/>
			) }
		</CommentsList>
	);
};

export default withArchive(
	comments,
	state => state.comments,
	props => {
		const { post } = props;

		comments.registerArchive( post.id, {
			post: post.id,
			per_page: 100,
		} );
		return post.id;
	},
)( PostComments );
