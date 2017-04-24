// @flow
import React from 'react';
import './Post.css';
import Avatar from './Avatar';
import CommentsList from './CommentsList';
import PostContent from './PostContent'
import type { Post as PostType, User, Comment } from '../types';

export default function Post(
	props: {
		author: ?User,
		post: PostType,
		children: ?any,
	}
) {
	return (
		<div className="Post">
			<div>
				<Avatar
					url={props.author ? props.author.avatar_urls['96'] : ''}
					size={70}
				/>
				<div className="body">
					<h2 dangerouslySetInnerHTML={{ __html: props.post.title.rendered }} />
					<PostContent html={props.post.content.rendered} />
				</div>
			</div>
			{props.children}
		</div>
	);
}
