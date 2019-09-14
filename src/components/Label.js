import React from 'react';

import './Label.css';

export default function Label( props ) {
	const Element = props.tagName;
	return (
		<Element
			{ ...props }
			className={ `Label ${ props.className || '' }`}
		>
			{ props.children }
		</Element>
	);
}

Label.defaultProps = {
	tagName: 'span',
};
