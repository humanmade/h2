import PropTypes from 'prop-types';
import React from 'react';

import './HeaderLabel.css';

export default function HeaderButton( props ) {
	return (
		<button onClick={ props.onClick } className={ `HeaderLabel label ${ props.className || '' }` }>
			{ props.icon && <span
				className={ 'icon icon--blue icon--' + props.icon }
			></span> }
			{ props.title }
		</button>
	);
}

HeaderButton.propTypes = {
	title: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
};
