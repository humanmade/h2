// @flow
import React from 'react';
import './CommentsList.css';
import type { Comment, Post } from '../types';
import CommentComponent from '../containers/Comment';
import WriteComment from '../containers/WriteComment';

import Button from './Button';

export default function CommentsList(
	props: {
		comments: Array<Comment>,
		showWriteComment: boolean,
		onComment: () => mixed,
		post: Post,
		writingComment: Comment,
	}
) {
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
