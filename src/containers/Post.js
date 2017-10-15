import React, { Component } from 'react';
import { connect } from 'react-redux';

import CommentsList from '../components/CommentsList';
import Post from '../components/Post';
import { threadComments } from '../lib/comments';
import Status from '../components/Status';
import {
	Post as PostShape,
	PostsState,
	UsersState,
	Dispatch,
	CommentsState,
	WriteCommentsState,
} from '../shapes';


class ConnectedPost extends Component {
	onComment() {
		this.props.dispatch({
			type: 'SHOW_REPLY_TO_POST',
			payload: {
				postId: this.props.post.id,
			},
		});
	}
	render() {
		const post = this.props.post;
        const author = this.props.users.byId[ post.author ];
        let comments = Object.values( this.props.comments.byId )
            .filter( comment => comment.post === post.id );

        comments = threadComments( comments );

		const commentsList = (
			<CommentsList
				comments={comments}
				onComment={() => this.onComment()}
				post={this.props.post}
				showWriteComment={
					this.props.writeComments[this.props.post.id].isShowing
				}
				writingComment={this.props.writeComments[this.props.post.id].comment}
			/>
		);
		return post.title.rendered === ''
			? <Status author={author} post={post}>{commentsList}</Status>
			: <Post author={author} post={post} onComment={() => this.onComment()}>{commentsList}</Post>;
	}
}

ConnectedPost.propTypes = {
	dispatch: Dispatch.isRequired,
	comments: CommentsState.isRequired,
	post: PostShape.isRequired,
	posts: PostsState.isRequired,
	users: UsersState.isRequired,
	writeComments: WriteCommentsState.isRequired,
};

export default connect(s => s)(ConnectedPost);
