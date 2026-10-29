import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';

export default function HeaderButton( props ) {
	return (
		<Button
			className={ [
				'group mb-0 mr-4 self-center',
				props.className,
			].filter( Boolean ).join( ' ' ) }
			onClick={ props.onClick }
		>
			{ props.icon && (
				<span
					className={ `icon icon--blue icon--${ props.icon }` }
				/>
			) }
			{ props.title }
		</Button>
	);
}

HeaderButton.propTypes = {
	title: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
};
