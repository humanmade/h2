// @flow
import React from 'react';
import './PostsList.css';
import Status from './Status';
import PostComponent from '../containers/Post';
import type { User, Post, Comment } from '../types';

export default function PostsList(
	props: {
		posts: Array<Post>,
	}
) {
	return (
		<div className="PostsList">
			{props.posts.map(post => (
				<PostComponent
					key={post.id}
					post={post}
				/>
			))}
		</div>
	);
}
