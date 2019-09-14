import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';

import './HeaderButton.css';

export default function HeaderButton( props ) {
	return (
		<button onClick={ props.onClick } className="HeaderButton">
			{ props.icon && (
				<Icon color="black" type={ props.icon } />
			) }
			<span className="HeaderButton-title">{ props.title }</span>
		</button>
	);
}

HeaderButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
