// @flow
import React from 'react';
import './PostsList.css';
import Status from './Status';
import PostComponent from './Post';
import type { User, Post, Comment } from '../types';

export default function PostsList(
	props: {
		posts: Array<Post>,
		users: { [userId: number]: User },
		comments: { [commentId: number]: Array<Comment> },
	}
) {
	return (
		<div className="PostsList">
			{props.posts.map(
				post =>
					(post.title.rendered === ''
						? <Status
								key={post.id}
								post={post}
								author={props.users[post.author]}
								comments={props.comments}
							/>
						: <PostComponent
								key={post.id}
								post={post}
								author={props.users[post.author]}
								comments={props.comments}
							/>)
			)}
		</div>
	);
}
