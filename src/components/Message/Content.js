import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Notification from '../Notification';
import matchers from '../../matchers';

import './Content.css';

class ErrorBoundary extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			error: false,
		};
	}

	componentDidCatch( error, info ) {
		this.setState( { error } );
	}

	render() {
		if ( this.state.error ) {
			return (
				<Notification type="error">
					A problem occurred while rendering this content. Please report this as a bug.<br />
					<code>{ this.state.error.toString() }</code>
				</Notification>
			);
		}

		return this.props.children;
	}
}

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
			<ErrorBoundary>
				<Interweave
					commonClass={ null }
					content={ props.html }
					matchers={ matchers }
					tagName="fragment"
				/>
			</ErrorBoundary>
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
