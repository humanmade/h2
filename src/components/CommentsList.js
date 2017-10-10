import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import CommentComponent from '../containers/Comment';
import WriteComment from '../containers/WriteComment';
import { Comment, Post } from '../shapes';

import './CommentsList.css';

export default function CommentsList( props ) {
	return (
		<div className="CommentsList">
			{props.comments.map(comment => (
				<CommentComponent key={comment.id} comment={comment} />
			))}
			{props.showWriteComment
				? <WriteComment post={props.post} comment={props.writingComment} />
				: <div className="post-reply">
						<Button onClick={props.onComment}>Reply</Button>
					</div>}

		</div>
	);
}

CommentsList.propTypes = {
	comments: PropTypes.arrayOf( Comment ).isRequired,
	post: Post.isRequired,
	showWriteComment: PropTypes.bool.isRequired,
	writingComment: Comment.isRequired,
	onComment: PropTypes.func.isRequired,
};
