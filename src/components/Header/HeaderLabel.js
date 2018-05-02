import PropTypes from 'prop-types';
import React from 'react';

import './HeaderLabel.css';

export default function HeaderButton( props ) {
	return <button onClick={props.onClick} className="HeaderLabel label">
		{ props.icon && <span
			className={ 'icon icon--red icon--' + props.icon }
		></span> }
		{ props.title }
	</button>;
}

HeaderButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
