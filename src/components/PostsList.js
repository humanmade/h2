// @flow
import React from 'react';
import './PostsList.css';
import PostComponent from '../containers/Post';
import type { Post } from '../types';

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
