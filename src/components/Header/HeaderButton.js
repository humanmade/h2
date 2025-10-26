import PropTypes from 'prop-types';
import React from 'react';

export default function HeaderButton( props ) {
	return (
		<button
			onClick={ props.onClick }
			className="block bg-black/5 text-black/50 p-0 w-[180px] uppercase font-semibold text-center border-none cursor-pointer transition-all duration-[180ms] outline-none hover:text-hm-dark-grey focus:text-hm-dark-grey focus:outline focus:outline-1 focus:outline-hm-dark-grey active:outline active:outline-1 active:outline-brand max-[600px]:w-auto max-[600px]:min-w-[60px] [&+button]:border-l [&+button]:border-l-black/5"
		>
			{ props.icon && <span
				className={ 'icon icon--' + props.icon + ' icon--black mr-2.5 -ml-2 opacity-50 hover:opacity-100 focus:opacity-100 max-[600px]:m-0' }
			></span> }
			<span className="max-[600px]:hidden">{ props.title }</span>
		</button>
	);
}

HeaderButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
