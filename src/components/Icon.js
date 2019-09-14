import PropTypes from 'prop-types';
import React from 'react';

import './Icon.css';

export default function Icon( props ) {
	const classes = [
		'Icon',
		`Icon--type-${ props.type }`,
		props.color !== 'black' && `Icon--color-${ props.color }`,
	];

	return (
		<i className={ classes.filter( Boolean ).join( ' ' ) }>
			{ props.children }
		</i>
	);
}

Icon.defaultProps = {
	color: 'red',
};

Icon.propTypes = {
	type: PropTypes.string.isRequired,
	color: PropTypes.oneOf( [
		'black',
		'red',
		'white',
	] ),
};
