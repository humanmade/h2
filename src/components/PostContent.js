import PropTypes from 'prop-types';
import React from 'react';

import './PostContent.css';

export default function PostContent( props ) {
	return <div
		className="PostContent"
		dangerouslySetInnerHTML={{ __html: props.html }}
	/>;
}

PostContent.propTypes = { html: PropTypes.string.isRequired };
