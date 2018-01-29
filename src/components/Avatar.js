import PropTypes from 'prop-types';
import React from 'react';

import Link from './RelativeLink';

import './Avatar.css';

export default function Avatar( props ) {
	const style = {
		width:  props.size,
		height: props.size,
	};
	return <div
		className="Avatar"
		style={ {
			width:  props.size + 'px',
			height: props.size + 'px',
		} }
	>
		<Link to={props.user ? props.user.link : ''}>
		<img
			style={style}
			alt="User Avatar"
			src={
				props.url === ''
					? 'https://www.timeshighereducation.com/sites/default/files/byline_photos/default-avatar.png'
					: props.url
			}
		/>
		</Link>
	</div>;
}

Avatar.propTypes = {
	size: PropTypes.number.isRequired,
	url:  PropTypes.string.isRequired,
	user: PropTypes.object,
};
