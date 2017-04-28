// @flow
import React from 'react';
import './Status.css';
import Avatar from './Avatar';
import type { Post, User } from '../types';

export default function Status(
	props: {
		author: ?User,
		post: Post,
		children?: any,
	}
) {
	return (
		<div className="Status">
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={50}
			/>
			<div
				className="body"
				dangerouslySetInnerHTML={{
					__html: `<strong>${props.author ? props.author.name : ''} says</strong>  ${props.post.content.rendered}`,
				}}
			/>
			{props.children}
		</div>
	);
}
