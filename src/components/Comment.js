import React from 'react';

import Avatar from './Avatar';
import PostContent from './PostContent';
import { User, Comment as CommentShape } from '../shapes';

import './Comment.css';

export default function Comment( props ) {
	return <div className="Comment">
		<header>
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={50}
			/>
			<strong>{props.author ? props.author.name : ''}</strong>
		</header>
		<div className="body">
			<PostContent html={props.comment.content.rendered} />
		</div>
	</div>;
}

Comment.propTypes = {
	author:  User,
	comment: CommentShape.isRequired,
};
