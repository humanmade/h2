import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';
import { Post, User } from '../shapes';

import './Status.css';

export default function Status( props ) {
	return <div className="Status">
		<div>
			<Avatar
				url={ props.author ? props.author.avatar_urls['96'] : '' }
				size={ 50 }
			/>
			<div
				className="body"
				dangerouslySetInnerHTML={ { __html: `<strong>${ props.author ? props.author.name : '' } says</strong>  ${ props.post.content.rendered }` } }
			/>
		</div>

		{ props.children }
	</div>;
}

Status.propTypes = {
	author: User,
	children: PropTypes.any,
	post: Post.isRequired,
};
