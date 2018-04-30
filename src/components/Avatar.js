import PropTypes from 'prop-types';
import React from 'react';

import AuthorLink from './Message/AuthorLink';

import './Avatar.css';

export default function Avatar( props ) {
	const style = {
		width: props.size,
		height: props.size,
	};

	return (
		<div
			className="Avatar"
			style={ {
				width: props.size + 'px',
				height: props.size + 'px',
			} }
		>
			<AuthorLink
				user={ props.user || null }
				withHovercard={ props.withHovercard }
			>
				<img
					style={ style }
					alt="User Avatar"
					src={ props.url || window.H2Data.site.default_avatar }
				/>
			</AuthorLink>
		</div>
	);
}

Avatar.propTypes = {
	size: PropTypes.number.isRequired,
	url: PropTypes.string.isRequired,
	user: PropTypes.object,
	withHovercard: PropTypes.bool.isRequired,
};

Avatar.defaultProps = {
	withHovercard: true,
};
