import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { MentionMatcher } from './Mention';

import './Content.css';

const MATCHERS = [
	new MentionMatcher( 'mention' ),
];

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
				matchers={ MATCHERS }
				tagName="fragment"
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