import React, { Component } from 'react';

import MessageContent from './Message/Content';
import compileMarkdown from '../compile-markdown';
import { withApiData } from '../with-api-data';

class RemotePreview extends Component {
	state: {
		isFetching: false,
		compiledPreview: '',
	};

	componentWillMount() {
		this.onUpdateMarkdown();
	}

	onUpdateMarkdown() {
		const compiledMarkdown = compileMarkdown( this.props.children );
		this.setState( {
			compiledPreview: compiledMarkdown,
			isFetching: true,
		} );
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
					isFetching: false,
				} );
			} );
	}

	render() {
		return (
			<div className="Editor-preview">
				<MessageContent html={ this.state.compiledPreview } />
			</div>
		);
	}
}

export default withApiData( () => ( {} ) )( RemotePreview );
