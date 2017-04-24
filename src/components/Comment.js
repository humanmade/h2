// @flow
import React from 'react';
import './Comment.css';
import type { User, Comment as CommentType } from '../types';
import Avatar from './Avatar';
import PostContent from './PostContent';

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
				<PostContent html={props.comment.content.rendered} />
			</div>
		</div>
	);
}
