// @flow
import React from 'react';
import './CommentsList.css';
import type { Comment, User } from '../types';
import CommentComponent from '../containers/Comment';

export default function CommentsList(props: { comments: Array<Comment> }) {
	return (
		<div className="CommentsList">
			{props.comments.map(comment => (
				<CommentComponent key={comment.id} comment={comment} />
			))}
		</div>
	);
}
