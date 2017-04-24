// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../components/Post';
import Status from '../components/Status';
import CommentsList from '../components/CommentsList';

class ConnectedPost extends Component {
	render() {
		const post = this.props.post;
		const author = this.props.users.byId[post.author];
		const comments = post.related.comments.items.map(
			commentId => this.props.comments.byId[commentId]
		);

		const commentsList = <CommentsList comments={comments} />;
		return post.title.rendered === ''
			? <Status author={author} post={post}>{commentsList}</Status>
			: <Post author={author} post={post}>{commentsList}</Post>;
	}
}

export default connect(s => s)(ConnectedPost);
