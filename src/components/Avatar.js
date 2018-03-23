import PropTypes from 'prop-types';
import React from 'react';

import Link from './RelativeLink';
import UserHovercard from './UserHovercard';

import './Avatar.css';

export default function Avatar( props ) {
	const style = {
		width:  props.size,
		height: props.size,
	};
	const avatar = <div
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
				src={ props.url || window.H2Data.site.default_avatar }
			/>
		</Link>
	</div>;

	if ( ! props.user || ! props.withHovercard ) {
		return avatar;
	}

	return <UserHovercard user={ props.user }>
		{ avatar }
	</UserHovercard>;
}

Avatar.propTypes = {
	size:          PropTypes.number.isRequired,
	url:           PropTypes.string.isRequired,
	user:          PropTypes.object,
	withHovercard: PropTypes.bool.isRequired,
};

Avatar.defaultProps = { withHovercard: true };
