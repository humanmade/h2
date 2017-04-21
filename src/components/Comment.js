// @flow
import React from 'react';
import './Comment.css';
import type { User, Comment as CommentType } from '../types';
import Avatar from './Avatar';

export default function Comment(
	props: { comment: CommentType, author: ?User }
) {
	return (
		<div className="Comment">
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={50}
			/>
			<div className="body">
				<strong>{props.author ? props.author.name : ''}</strong>
				<div
					className="content"
					dangerouslySetInnerHTML={{ __html: props.comment.content.rendered }}
				/>
			</div>
		</div>
	);
}
