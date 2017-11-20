import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';
import Editor from './Editor';
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
				defaultValue={ props.autosave }
				submitText="Publish"
				onAutosave={ props.onAutosave }
				onCancel={props.onCancel}
				onSubmit={props.onSave}
				onUpload={ props.onUpload }
			/>
		{props.children}

	</div>
}

WritePost.propTypes = {
	author:   User,
	autosave: PropTypes.string,
	post:     Post.isRequired,
	onAutosave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSave:   PropTypes.func.isRequired,
	onUpload: PropTypes.func.isRequired,
};
