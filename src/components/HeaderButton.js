import PropTypes from 'prop-types';
import React from 'react';

import './HeaderButton.css';

export default function HeaderButton( props ) {
	return <button onClick={props.onClick} className="HeaderButton">
		{ props.icon && <span
			className={ 'icon icon--' + props.icon + ' icon--black' }
		></span> }
		{props.title}
	</button>;
}

HeaderButton.propTypes = {
	title:   PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
