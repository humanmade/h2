import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';

import { MentionMatcher } from './Mention';
import getEmbedTransform from '../../embeds';

import '@humanmade/react-tasklist/css/index.css';
import './Content.css';

const MATCHERS = [
	new MentionMatcher( 'mention' ),
];

export default function Content( props ) {
	const transform = getEmbedTransform( props );

	return <div className="PostContent">
		<Interweave
			commonClass={ null }
			content={ props.html }
			matchers={ MATCHERS }
			tagName="fragment"
			transform={ transform }
		/>
	</div>;
}

Content.propTypes = { html: PropTypes.string.isRequired };
