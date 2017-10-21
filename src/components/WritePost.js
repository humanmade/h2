import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';
import Editor from '../containers/Editor';
import { User, Post } from '../shapes';

import './WritePost.css';

export default function WritePost( props ) {
	return <div className="WritePost">
		<header>
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={70}
			/>
			<div className="byline">
				<h2 dangerouslySetInnerHTML={{ __html: props.post.title.rendered }} />
				<div className="date">
					{props.author ? props.author.name : ''}, now
				</div>
			</div>
			<div className="actions"></div>
		</header>
		<Editor
				submitText="Publish"
				onCancel={props.onCancel}
				onSubmit={props.onSave}
			/>
		{props.children}

	</div>
}

WritePost.propTypes = {
	author:   User,
	post:     Post.isRequired,
	onCancel: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSave:   PropTypes.func.isRequired,
};
