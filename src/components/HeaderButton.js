import PropTypes from 'prop-types';
import React from 'react';

import './HeaderButton.css';
export default function IconButton( props ) {
	return <button onClick={props.onClick} className="HeaderButton btn">
		{ props.icon && <span
			className={ 'icon icon--' + props.icon + ' icon--white' }
		></span> }
		{props.title}
	</button>;
}

IconButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
