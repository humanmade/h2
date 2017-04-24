// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Comment as CommentType } from '../types';
import Comment from '../components/Comment';
import Status from '../components/Status';

class ConnectedComment extends Component {
	props: {
		comment: CommentType,
		chidren: ?any,
	}
	render() {
		const comment = this.props.comment;
		const post = this.props.posts.byId[comment.post];
		const author = this.props.users.byId[comment.author];
		return <Comment author={author} comment={this.props.comment} post={post}>{this.props.chidren}</Comment>;
	}
}

export default connect(s => s)(ConnectedComment);
