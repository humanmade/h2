import PropTypes from 'prop-types';
import React from 'react';

export default function HeaderButton( props ) {
	return (
		<button
			className={ [
				'group text-sm leading-6 border border-hm-vibrant-blue bg-white text-hm-vibrant-blue rounded-sm mr-4 px-2 self-center',
				'cursor-pointer hover:bg-hm-vibrant-blue hover:text-white',
				props.className,
			].filter( Boolean ).join( ' ' ) }
			onClick={ props.onClick }
		>
			{ props.icon && (
				<span
					className={ `icon icon--blue icon--${ props.icon } group-hover:text-white` }
				/>
			) }
			{ props.title }
		</button>
	);
}

HeaderButton.propTypes = {
	title: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
};
