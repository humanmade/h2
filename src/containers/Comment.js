// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Comment as CommentType, PostsState, UsersState } from '../types';
import Comment from '../components/Comment';


type props = {
	posts: PostsState,
	users: UsersState,
	comment: CommentType,
	chidren: ?any,
}

class ConnectedComment extends Component {
	props: props
	render() {
		const comment = this.props.comment;
		const post = this.props.posts.byId[comment.post];
		const author = this.props.users.byId[comment.author];
		return <Comment author={author} comment={this.props.comment} post={post}>{this.props.chidren}</Comment>;
	}
}

export default connect(s => s)(ConnectedComment);
