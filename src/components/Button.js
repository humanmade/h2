import PropTypes from 'prop-types';
import React from 'react';

import './Button.css';

export default function Button( props ) {

	let classes = [ 'btn' ];

	if ( props.type ) {
		classes.push( 'btn--' + props.type );
	}

	if ( props.size ) {
		classes.push( 'btn--' + props.size );
	}

	if ( props.className ) {
		classes.push( props.className );
	}

	return (
		<button
			className={ classes.join( ' ' ) }
			disabled={ props.disabled }
			type={ props.submit ? 'submit' : 'button' }
			onClick={ props.onClick || undefined }
		>
			{props.children}
		</button>
	);
}

Button.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	submit: PropTypes.bool,
	onClick: PropTypes.func,
	type: PropTypes.string,
	size: PropTypes.string,
};

Button.defaultProps = {
	className: null,
	disabled: false,
	type: 'secondary',
	size: 'small',
	submit: false,
}
