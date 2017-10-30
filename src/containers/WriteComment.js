import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { uploadMedia } from '../actions';
import WriteComment from '../components/WriteComment';
import { Post, PostsState, UsersState, Comment, Dispatch } from '../shapes';
import store from '../store';

class ConnectedWriteComment extends Component {
	onCancel() {
		this.props.dispatch( {
			type:    'WRITE_COMMENT_CANCELLED',
			payload: { postId: this.props.post.id, comment: this.props.comment },
		} );
	}
	onSave( content ) {
		const newComment = {
			content,
			parent: this.props.comment.parent,
			post: this.props.comment.post,
		};
		this.props.dispatch( store.actions.comments.create( newComment ) );
	}
	onChange( comment ) {
		this.props.dispatch( {
			type:    'WRITE_COMMENT_UPDATED',
			payload: {
				comment,
				postId: this.props.post.id,
			},
		} );
	}
	onUpload( file ) {
		return this.props.dispatch( uploadMedia( file ) );
	}
	render() {
		const post = this.props.post;
		const author = Object.values( this.props.user.byId )[0];
		return <WriteComment
			author={author}
			comment={this.props.comment}
			post={post}
			onCancel={() => this.onCancel()}
			onChange={comment => this.onChange( comment )}
			onSave={ comment => this.onSave( comment ) }
			onUpload={ file => this.onUpload( file ) }
		/>;
	}
}

ConnectedWriteComment.propTypes = {
	children: PropTypes.any,
	comment:  Comment.isRequired,
	dispatch: Dispatch.isRequired,
	post:     Post.isRequired,
	posts:    PostsState.isRequired,
	user:     UsersState.isRequired,
};

export default connect( s => s )( ConnectedWriteComment );
