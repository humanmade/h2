import PropTypes from 'prop-types';
import React from 'react';

import Notification from './Notification';
import MessageContent from './Message/Content';
import compileMarkdown from '../compile-markdown';
import { withApiData } from '../with-api-data';

class RemotePreview extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: true,
			compiledPreview: '',
		};
	}

	componentDidMount() {
		this.onUpdateMarkdown();
	}

	onUpdateMarkdown() {
		this.setState( {
			isLoading: true,
		} );

		const compiledMarkdown = compileMarkdown( this.props.children );
		const body = {
			html: compiledMarkdown,
			type: this.props.type,
		};

		this.props.fetch( '/h2/v1/preview', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method: 'POST',
		} )
			.then( r => r.json() )
			.then( response => {
				this.setState( {
					compiledPreview: response.html,
					isLoading: false,
				} );
			} );
	}

	render() {
		if ( this.state.isLoading ) {
			return <Notification>Loading…</Notification>;
		}

		return (
			<div className="Editor-preview">
				<MessageContent html={ this.state.compiledPreview } />
			</div>
		);
	}
}

RemotePreview.propTypes = {
	type: PropTypes.oneOf( [
		'comment',
		'post',
	] ),
};

export default withApiData( () => ( {} ) )( RemotePreview );
