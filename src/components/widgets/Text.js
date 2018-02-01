import React from 'react';

export default function Text( props ) {
	return <div>
		{ props.title && <h4>{ props.title }</h4> }
		<div dangerouslySetInnerHTML={{ __html: props.text }} />
	</div>
}
