import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';
import Label from '../Label';

import './HeaderLabel.css';

export default function HeaderLabel( props ) {
	return (
		<Label
			className={ `HeaderLabel ${ props.className || '' }` }
			tagName="button"
			onClick={ props.onClick }
		>
			{ props.icon && (
				<Icon type={ props.icon } />
			) }
			{ props.title }
		</Label>
	);
}

HeaderLabel.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
