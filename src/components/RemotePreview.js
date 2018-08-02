import React, { Component } from 'react';

import Notification from './Notification';
import MessageContent from './Message/Content';
import compileMarkdown from '../compile-markdown';
import { withApiData } from '../with-api-data';

class RemotePreview extends Component {
	state: {
		isLoading: true,
		compiledPreview: '',
	};

	componentDidMount() {
		this.onUpdateMarkdown();
	}

	onUpdateMarkdown() {
		this.setState( {
			isLoading: true,
		} );

		const compiledMarkdown = compileMarkdown( this.props.children );
		const body = { html: compiledMarkdown };
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

export default withApiData( () => ( {} ) )( RemotePreview );
