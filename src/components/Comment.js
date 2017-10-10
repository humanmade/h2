import React from 'react';

import Avatar from './Avatar';
import PostContent from './PostContent';
import { User, Comment as CommentShape } from '../shapes';

import './Comment.css';

export default function Comment( props ) {
	return <div className="Comment">
		<Avatar
			url={props.author ? props.author.avatar_urls['96'] : ''}
			size={50}
		/>
		<div className="body">
			<header>
				<strong>{props.author ? props.author.name : ''}</strong>
			</header>
			<PostContent html={props.comment.content.rendered} />
		</div>
	</div>;
}

Comment.propTypes = {
	author: User,
	comment: CommentShape.isRequired,
};
