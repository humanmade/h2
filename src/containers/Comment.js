import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Comment from '../components/Comment';
import CommentsList from '../components/CommentsList';
import { Comment as CommentShape, PostsState, UsersState } from '../shapes';

class ConnectedComment extends Component {
	onReply() {
		this.props.dispatch( {
			type:    'SHOW_REPLY_TO_COMMENT',
			payload: { commentId: this.props.comment.id, postId: this.props.comment.post },
		} );
	}
	render() {
		const comment = this.props.comment;
		const post = this.props.posts.byId[comment.post];
		const author = this.props.users.byId[comment.author];
		const comments = Object.values( this.props.comments.byId ).filter( c => c.parent === comment.id );
		return <Comment
				author={author}
				comment={this.props.comment}
				post={post}
				onReply={() => this.onReply()}
			>
				<CommentsList
					comments={comments}
					onComment={() => this.onReply()}
					post={post}
					showWriteComment={
						this.props.writeComments.comments[comment.id].isShowing
					}
					writingComment={this.props.writeComments.comments[comment.id].comment}
				/>
		</Comment>;
	}
}

ConnectedComment.propTypes = {
	posts:   PostsState.isRequired,
	users:   UsersState.isRequired,
	comment: CommentShape.isRequired,
	chidren: PropTypes.any,
};

export default connect( s => s )( ConnectedComment );
