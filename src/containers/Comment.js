import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Comment from '../components/Comment';
import CommentsList from '../components/CommentsList';
import { Comment as CommentShape } from '../shapes';

import { withApiData } from '../with-api-data';

class ConnectedComment extends Component {
	onReply() {
		this.props.dispatch( {
			type:    'SHOW_REPLY_TO_COMMENT',
			payload: { commentId: this.props.comment.id, postId: this.props.comment.post },
		} );
	}
	render() {
		const comment = this.props.comment;
		const post = this.props.post;
		const author = this.props.author.data;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );
		return <Comment
			author={author}
			comment={this.props.comment}
			post={post}
			onReply={() => this.onReply()}
		>
			<CommentsList
				allComments={this.props.comments}
				comments={directComments}
				post={post}
				showWriteComment={
					this.props.writeComments.comments[comment.id] && this.props.writeComments.comments[comment.id].isShowing
				}
				writingComment={this.props.writeComments.comments[comment.id] && this.props.writeComments.comments[comment.id].comment}
				onComment={() => this.onReply()}
			/>
		</Comment>;
	}
}

ConnectedComment.propTypes = {
	comment:  CommentShape.isRequired,
	children: PropTypes.any,
};

export default withApiData( props => ( { author: `/wp/v2/users/${ props.comment.author }` } ) )( connect( s => s )( ConnectedComment ) );
