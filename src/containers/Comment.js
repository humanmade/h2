import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Comment from '../components/Comment';
import { Comment as CommentShape, PostsState, UsersState } from '../shapes';

class ConnectedComment extends Component {
	render() {
		const comment = this.props.comment;
		const post = this.props.posts.byId[comment.post];
		const author = this.props.users.byId[comment.author];
		return <Comment author={author} comment={this.props.comment} post={post}>{this.props.chidren}</Comment>;
	}
}

ConnectedComment.propTypes = {
	posts: PostsState.isRequired,
	users: UsersState.isRequired,
	comment: CommentShape.isRequired,
	chidren: PropTypes.any,
};

export default connect(s => s)(ConnectedComment);
