import PropTypes from 'prop-types';
import React from 'react';

export const TYPES = {
	STATUS: 'status',
	ALERT: 'alert',
	ERROR: 'error',
};

const BASE_CLASSES = [
	// Back-compat:
	'Notification',

	'rounded mt-0 p-[1.1em] text-[0.777777778em]',
	'border border-solid border-current',
].join( ' ' );

const TYPE_CLASSES = {
	status: 'bg-[#ECF6FA] text-[#009ACE]',
	alert: 'bg-[#FFFAE2] text-[#DB7E26]',
	error: 'bg-[#FFF2F4] text-[#FF001F]',
};

export default function Notification( props ) {
	const classes = [ BASE_CLASSES, TYPE_CLASSES[ props.type ] ].join( ' ' );

	return (
		<p className={ classes }>
			{ props.children }
		</p>
	);
}

Notification.defaultProps = {
	type: 'status',
};

Notification.propTypes = {
	type: PropTypes.oneOf( Object.values( TYPES ) ),
};
