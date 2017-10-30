import React from 'react';
import PropTypes from 'prop-types';

import AuthorName from './AuthorName';
import Avatar from './Avatar';
import PostContent from './PostContent';
import Button from './Button';
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
			<div className="actions">
				<Button onClick={props.onReply}>Reply</Button>
			</div>
		</header>
		<div className="body">
			<PostContent html={props.comment.content.rendered} />
		</div>
		{props.children}
	</div>;
}

Comment.propTypes = {
	author:  User,
	comment: CommentShape.isRequired,
	onReply: PropTypes.func.isRequired,
};
