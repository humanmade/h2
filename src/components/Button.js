import PropTypes from 'prop-types';
import React from 'react';

import './Button.css';

export default function Button( props ) {
	return (
		<button onClick={props.onClick} className="Button">
			{props.children}
		</button>
	);
}

Button.propTypes = {
	children: PropTypes.any,
	onClick: PropTypes.func.isRequired,
};
