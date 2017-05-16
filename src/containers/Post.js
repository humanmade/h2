// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../components/Post';
import type {
	Post as PostType,
	PostsState,
	UsersState,
	Dispatch,
	CommentsState,
	WriteCommentsState,
} from '../types';
import Status from '../components/Status';
import CommentsList from '../components/CommentsList';

class ConnectedPost extends Component {
	props: {
		post: PostType,
		posts: PostsState,
		users: UsersState,
		comments: CommentsState,
		dispatch: Dispatch,
		writeComments: WriteCommentsState,
	};
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
		const author = this.props.users.byId[post.author];
		const comments = this.props.posts.relations.comments[post.id].items.map(
			commentId => this.props.comments.byId[commentId]
		);

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
			: <Post author={author} post={post}>{commentsList}</Post>;
	}
}

export default connect(s => s)(ConnectedPost);
