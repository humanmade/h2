import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from './Avatar';
import Button from './Button';
import { User, Post } from '../shapes';

import './WritePost.css';

export default function WritePost( props ) {
	return <div className="WritePost">
		<div>
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={70}
			/>
			<div className="body">
				<div className="date">
					<FormattedRelative value={props.post.date_gmt} />
				</div>
				<span className="buttons">
					<Button onClick={props.onCancel}>Cancel</Button>
					<Button onClick={props.onSave}>Publish</Button>
				</span>
			</div>
		</div>
	</div>;
}

WritePost.propTypes = {
	author: User,
	post: Post.isRequired,
	onCancel: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};
