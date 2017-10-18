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

	return <button
		className={ classes.join( ' ' ) }
		type={ props.submit ? 'submit' : 'button' }
		onClick={ props.onClick || undefined }
	>
		{props.children}
	</button>;
}

Button.propTypes = {
	children: PropTypes.any,
	submit:   PropTypes.bool,
	onClick:  PropTypes.func,
	type:     PropTypes.string,
	size:     PropTypes.string,
};

Button.defaultProps = {
	type:   'secondary',
	size:   'small',
	submit: false,
}
