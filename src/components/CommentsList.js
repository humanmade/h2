import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CommentComponent from '../containers/Comment';
import WriteComment from '../containers/WriteComment';
import { Comment, Post } from '../shapes';

import './CommentsList.css';

export default class CommentsList extends Component {
	render() {
		return <div className="CommentsList">
			{this.props.comments.map( comment => (
				<CommentComponent post={this.props.post} key={comment.id} comments={this.props.allComments} comment={comment} />
			) ) }
			{this.props.showWriteComment &&
				<WriteComment post={this.props.post} comment={this.props.writingComment} />
			}
		</div>;
	}
}

CommentsList.propTypes = {
	allComments:      PropTypes.arrayOf( Comment ).isRequired,
	comments:         PropTypes.arrayOf( Comment ).isRequired,
	post:             Post.isRequired,
	showWriteComment: PropTypes.bool.isRequired,
	writingComment:   Comment.isRequired,
	onComment:        PropTypes.func.isRequired,
};
