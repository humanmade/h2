import PropTypes from 'prop-types';
import React from 'react';

import './Notification.css';

export const TYPES = {
	STATUS: 'status',
	ALERT: 'alert',
	ERROR: 'error',
};

export default function Notification( props ) {
	return <p className={ `Notification Notification--${ props.type }` }>
		{ props.children }
	</p>;
}

Notification.defaultProps = {
	type: 'status',
};

Notification.propTypes = {
	type: PropTypes.oneOf( Object.values( TYPES ) ),
};
