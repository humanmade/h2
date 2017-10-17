import PropTypes from 'prop-types';
import React from 'react';

import './Button.css';

export default function Button( props ) {
	return <button
		className="btn btn--secondary btn--small"
		type={ props.submit ? "submit" : "button" }
		onClick={ props.onClick || undefined }
	>
		{props.children}
	</button>;
}

Button.propTypes = {
	children: PropTypes.any,
	submit: PropTypes.bool,
	onClick: PropTypes.func,
};
