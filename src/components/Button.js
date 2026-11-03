import PropTypes from 'prop-types';
import React from 'react';

const TYPE_CLASSES = {
	primary: 'border-hm-vibrant-blue bg-hm-vibrant-blue text-white enabled:hover:bg-[#3b53d1] enabled:hover:border-[#3b53d1] enabled:active:bg-[#3045b8]',
	secondary: 'border-[#dfe1e5] bg-white text-[#41454d] enabled:hover:bg-[#f5f6f8] enabled:hover:border-[#c8ccd3] enabled:active:bg-[#eceef2]',
	tertiary: 'border-transparent bg-transparent text-[#626873] enabled:hover:bg-[#f0f1f4] enabled:hover:text-[#30343b] enabled:active:bg-[#e5e7eb]',
	inverted: 'border-white/30 bg-white/10 text-white enabled:hover:bg-white/20 enabled:hover:border-white/50 enabled:active:bg-white/30',
};

const SIZE_CLASSES = {
	regular: 'min-h-9 px-3 py-1.5 text-sm leading-5',
	small: 'btn--small min-h-8 px-2.5 py-1 text-sm leading-5',
};

const BASE_CLASSES = [
	// Back-compat:
	'btn',

	'inline-flex items-center justify-center gap-1.5 align-middle',
	'font-medium border border-solid rounded-md',
	'w-auto cursor-pointer whitespace-nowrap no-underline shadow-none',
	'transition-colors duration-150 ease-out',
	'mb-3 mr-2',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue',
	'disabled:cursor-not-allowed disabled:opacity-45',
].join( ' ' );

export default function Button( { children, className, disabled, submit, onClick, type, size, ...buttonProps } ) {
	const classes = [
		BASE_CLASSES,
		TYPE_CLASSES[ type ] || TYPE_CLASSES.secondary,
		SIZE_CLASSES[ size || 'regular' ] || '',
		className,
	].filter( Boolean ).join( ' ' );

	return (
		<button
			{ ...buttonProps }
			className={ classes }
			disabled={ disabled }
			type={ submit ? 'submit' : 'button' }
			onClick={ onClick || undefined }
		>
			{ children }
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
