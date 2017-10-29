import React from 'react';

import AuthorName from './AuthorName';
import Avatar from './Avatar';
import PostContent from './PostContent';
import { User, Comment as CommentShape } from '../shapes';

import './Comment.css';

export default function Comment( props ) {
	return <div className="Comment">
		<header>
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={40}
			/>
			<strong>
				{ props.author ? <AuthorName user={ props.author } /> : '' }
			</strong>
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
