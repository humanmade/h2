import PropTypes from 'prop-types';
import React from 'react';

import './Content.css';

export default function Content( props ) {
	return <div
		className="PostContent"
		dangerouslySetInnerHTML={{ __html: props.html }}
	/>;
}

Content.propTypes = {
	html: PropTypes.string.isRequired,
};
