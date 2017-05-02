// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type {
	UsersState,
	Dispatch,
	WritePostState,
} from '../types';
import WritePost from '../components/WritePost';
import store from '../store';
import FrontKit from '@humanmade/frontkit';

class ConnectedWritePost extends Component {
	props: {
		writePost: WritePostState,
		user: UsersState,
		chidren: ?any,
		dispatch: Dispatch,
	};
	onCancel() {
		this.props.dispatch({
			type: 'WRITE_POST_CANCELLED',
		});
	}
	onSave() {
		const newPost = {
			content: FrontKit.export(this.props.writePost.post.content.edited),
			title: this.props.writePost.post.title.edited,
			status: 'publish',
		};
		this.props.dispatch(store.actions.posts.create(newPost));
	}
	onChange(post) {
		this.props.dispatch({
			type: 'WRITE_POST_UPDATED',
			payload: {
				post,
			},
		});
	}
	render() {
		const post = this.props.writePost.post;
		const author = Object.values(this.props.user.byId)[0];
		return (
			<WritePost
				author={author}
				post={post}
				onCancel={() => this.onCancel()}
				onChange={post => this.onChange(post)}
				onSave={() => this.onSave()}
			/>
		);
	}
}

export default connect(s => s)(ConnectedWritePost);
