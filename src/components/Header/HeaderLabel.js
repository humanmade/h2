import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';

import './HeaderLabel.css';

export default function HeaderButton( props ) {
	return (
		<button onClick={ props.onClick } className={ `HeaderLabel label ${ props.className || '' }` }>
			{ props.icon && (
				<Icon type={ props.icon } />
			) }
			{ props.title }
		</button>
	);
}

HeaderButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
