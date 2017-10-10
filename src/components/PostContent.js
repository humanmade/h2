import PropTypes from 'prop-types';
import React from 'react';

import './PostContent.css';

export default function Post( props ) {
	return (
		<div
			className="PostContent"
			dangerouslySetInnerHTML={{ __html: props.html }}
		/>
	);
}

Post.propTypes = {
	html: PropTypes.string.isRequired,
};
