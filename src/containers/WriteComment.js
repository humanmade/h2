// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Post, PostsState, UsersState, Comment, Dispatch } from '../types';
import WriteComment from '../components/WriteComment';
import store from '../store';
import FrontKit from '@humanmade/frontkit';

class ConnectedWriteComment extends Component {
	props: {
		post: Post,
		posts: PostsState,
		users: UsersState,
		comment: Comment,
		chidren: ?any,
		dispatch: Dispatch,
	};
	onCancel() {
		this.props.dispatch({
			type: 'WRITE_COMMENT_CANCELLED',
			payload: {
				postId: this.props.post.id,
			},
		});
	}
	onSave() {
		const newComment = {
			post: this.props.comment.post,
			content: FrontKit.export(this.props.comment.content.edited),
		};
		this.props.dispatch(store.actions.comments.create(newComment));
	}
	onChange(comment) {
		this.props.dispatch({
			type: 'WRITE_COMMENT_UPDATED',
			payload: {
				comment,
				postId: this.props.post.id,
			},
		});
	}
	render() {
		const post = this.props.post;
		const author = this.props.users.byId[post.author];
		return (
			<WriteComment
				author={author}
				comment={this.props.comment}
				post={post}
				onCancel={() => this.onCancel()}
				onChange={comment => this.onChange(comment)}
				onSave={() => this.onSave()}
			/>
		);
	}
}

export default connect(s => s)(ConnectedWriteComment);
