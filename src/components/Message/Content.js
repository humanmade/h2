import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';

import './Content.css';

export default function Content( props ) {
	return <div className="PostContent">
		<Interweave
			commonClass={ null }
			content={ props.html }
			tagName="fragment"
		/>
	</div>;
}

Content.propTypes = { html: PropTypes.string.isRequired };
