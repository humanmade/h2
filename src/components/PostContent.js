// @flow
import React from 'react';
import './PostContent.css';

export default function Post(
	props: {
		html: string,
	}
) {
	return (
		<div
			className="PostContent"
			dangerouslySetInnerHTML={{ __html: props.html }}
		/>
	);
}
