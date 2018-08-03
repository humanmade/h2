import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import SafeEmbed from './SafeEmbed';
import matchers from '../../matchers';

import './Content.css';

const transform = ( node, children ) => {
	switch ( node.tagName ) {
		// Trust embeds and iframes, as they have already passed through WP's validation.
		case 'EMBED':
		case 'IFRAME':
			return <SafeEmbed node={ node } />;
	}
};

function Content( props ) {
	if ( ! props.useInterweave ) {
		return (
			<div
				className="PostContent"
				dangerouslySetInnerHTML={ { __html: props.html } }
			/>
		);
	}

	return (
		<div className="PostContent">
			<Interweave
				commonClass={ null }
				content={ props.html }
				matchers={ matchers }
				tagName="fragment"
				transform={ transform }
			/>
		</div>
	);
}

Content.propTypes = {
	html: PropTypes.string.isRequired,
};

const mapStateToProps = state => ( {
	useInterweave: state.features.use_interweave,
} );

export default connect( mapStateToProps )( Content );
