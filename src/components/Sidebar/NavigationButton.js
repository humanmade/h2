import React from 'react';

const CLASSES = [
	'inline-flex items-center justify-center shrink-0 rounded-md border-0 bg-transparent m-0',
	'font-inherit text-sm font-normal leading-5 text-hm-dark-grey cursor-pointer',
	'hover:bg-hm-beige hover:text-black',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue',
	'transition-colors duration-150',
].join( ' ' );

export default function NavigationButton( { as: Component = 'button', children, className, direction = 'left', iconOnly = true, ...props } ) {
	return (
		<Component
			{ ...props }
			className={ [ CLASSES, iconOnly ? 'size-8 p-0' : 'h-8 px-2 gap-1', className ].filter( Boolean ).join( ' ' ) }
			title={ typeof children === 'string' ? children : undefined }
			type={ Component === 'button' ? 'button' : undefined }
		>
			{ ! iconOnly && direction === 'right' && <span>{ children }</span> }
			<svg aria-hidden="true" className={ `size-4 shrink-0 ${ direction === 'right' ? 'rotate-180' : '' }` } fill="none" viewBox="0 0 16 16">
				<path d="M10 3 5 8l5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
			</svg>
			{ iconOnly ? <span className="sr-only">{ children }</span> : direction === 'left' && <span>{ children }</span> }
		</Component>
	);
}
