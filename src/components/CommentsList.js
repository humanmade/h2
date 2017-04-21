// @flow
import React from 'react';
import './CommentsList.css';
import type { Comment, User } from '../types';
import CommentComponent from './Comment';

export default function CommentsList(
	props: { comments: Array<Comment>, users: { [userId: number]: User } }
) {
	return (
		<div className="CommentsList">
			{props.comments.map(comment => {
				<CommentComponent
					comment={comment}
					author={props.users[comment.author]}
				/>;
			})}
		</div>
	);
}
