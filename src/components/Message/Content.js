import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import matchers from '../../matchers';

import './Content.css';

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
