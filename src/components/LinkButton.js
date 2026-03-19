import React from 'react';

const CLASSES = [
	'inline font-[inherit] leading-none cursor-pointer',
	'bg-transparent border-none p-0 m-0 overflow-visible',
	'text-hm-vibrant-blue',
	'transition-[color,background] duration-200 ease-in',
	'hover:text-hm-vibrant-blue hover:underline hover:ease-out',
	'focus:text-hm-vibrant-blue focus:underline focus:outline-hidden focus:ease-out',
].join( ' ' );

export default class LinkButton extends React.Component {
	render() {
		const { className, ...props } = this.props;

		return (
			<button
				type="button"
				{ ...props }
				className={ [ CLASSES, className ].filter( Boolean ).join( ' ' ) }
			/>
		);
	}
}
