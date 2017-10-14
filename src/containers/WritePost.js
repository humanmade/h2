import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import WritePost from '../components/WritePost';
import { UsersState, Dispatch, WritePostState } from '../shapes';
import store from '../store';

class ConnectedWritePost extends Component {
	onCancel() {
		this.props.dispatch({
			type: 'WRITE_POST_CANCELLED',
		});
	}
	onSave() {
		const fkContent = this.props.writePost.post.content.edited;
		var title = '';
		if (
			fkContent.getCurrentContent().getBlockMap().first().getType() ===
			'header-one'
		) {
			title = fkContent.getCurrentContent().getBlockMap().first().getText();
		}
		const newPost = {
			// content: FrontKit.export(this.props.writePost.post.content.edited),
			title: title,
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
		return <WritePost
			author={author}
			post={post}
			onCancel={() => this.onCancel()}
			onChange={post => this.onChange(post)}
			onSave={() => this.onSave()}
		/>;
	}
}

ConnectedWritePost.propTypes = {
	children: PropTypes.any,
	dispatch: Dispatch.isRequired,
	user: UsersState.isRequired,
	writePost: WritePostState.isRequired,
};

export default connect(s => s)(ConnectedWritePost);
