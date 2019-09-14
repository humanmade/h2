import React from 'react';

import './Label.css';

export function LabelCount( props ) {
	return (
		<span class="Label__count">{ props.count }</span>
	);
}

export default function Label( props ) {
	const Element = props.tagName;
	return (
		<Element
			{ ...props }
			className={ `Label ${ props.className || '' }`}
		>
			{ props.children }
			{ Boolean( props.count && props.count > 0 ) && (
				<LabelCount count={ props.count } />
			) }
		</Element>
	);
}

Label.defaultProps = {
	tagName: 'span',
};
