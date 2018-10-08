import React from 'react';
import { Link } from 'react-router-dom';

export default function RelativeLink( props ) {
	const { to, ...otherProps } = props;

	const relativeTo = to.replace( /^(?:\/\/|[^/]+)*\//, '/' );

	return (
		<Link
			{ ...otherProps }
			to={ relativeTo }
		/>
	);
}
