import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';

import { MentionMatcher } from './Mention';

import './Content.css';

const MATCHERS = [
	new MentionMatcher( 'mention' ),
];

export default function Content( props ) {
	return <div className="PostContent">
		<Interweave
			commonClass={ null }
			content={ props.html }
			matchers={ MATCHERS }
			tagName="fragment"
		/>
	</div>;
}

Content.propTypes = { html: PropTypes.string.isRequired };
