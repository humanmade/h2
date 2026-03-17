import PropTypes from 'prop-types';
import React from 'react';

const TYPE_CLASSES = {
	primary: [
		'border-hm-vibrant-blue bg-hm-vibrant-blue text-white',
		'hover:bg-white hover:text-hm-vibrant-blue',
		'focus:bg-white focus:text-hm-vibrant-blue',
		'disabled:hover:bg-hm-vibrant-blue disabled:hover:text-white',
	].join( ' ' ),
	secondary: [
		'border-hm-vibrant-blue bg-white text-hm-vibrant-blue',
		'hover:bg-hm-vibrant-blue hover:text-white',
		'focus:bg-hm-vibrant-blue focus:text-white',
		'disabled:hover:bg-hm-vibrant-blue disabled:hover:text-white',
	].join( ' ' ),
	tertiary: [
		'border-hm-warm-grey bg-transparent text-hm-warm-grey',
		'hover:bg-hm-warm-grey hover:text-white',
		'focus:bg-hm-warm-grey focus:text-white',
		'disabled:hover:bg-transparent disabled:hover:text-hm-warm-grey',
	].join( ' ' ),
	inverted: [
		'border-white bg-transparent text-white',
		'hover:bg-white hover:text-hm-vibrant-blue hover:border-hm-vibrant-blue',
		'focus:bg-white focus:text-hm-vibrant-blue focus:border-hm-vibrant-blue',
	].join( ' ' ),
};

const SIZE_CLASSES = {
	regular: 'px-2',
	small: 'btn--small text-sm leading-6 border px-2 py-0',
};

const BASE_CLASSES = [
	// Back-compat:
	'btn',

	'font-light',
	'border border-solid rounded',
	'inline-block text-center align-middle cursor-pointer',
	'w-auto h-auto',
	'shadow-none no-underline',
	'transition-[background,border-color] duration-200 ease-in-out',
	'mb-[0.833rem] mr-[7.5px]',
	'focus:outline-none',
	'disabled:cursor-default disabled:opacity-30',
].join( ' ' );

export default function Button( props ) {
	const classes = [
		BASE_CLASSES,
		TYPE_CLASSES[ props.type ] || TYPE_CLASSES.secondary,
		SIZE_CLASSES[ props.size || 'regular' ] || '',
		props.className,
	].filter( Boolean ).join( ' ' );

	return (
		<button
			className={ classes }
			disabled={ props.disabled }
			type={ props.submit ? 'submit' : 'button' }
			onClick={ props.onClick || undefined }
		>
			{ props.children }
		</button>
	);
}

Button.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	submit: PropTypes.bool,
	onClick: PropTypes.func,
	type: PropTypes.string,
	size: PropTypes.string,
};

Button.defaultProps = {
	className: null,
	disabled: false,
	type: 'secondary',
	size: 'regular',
	submit: false,
};
