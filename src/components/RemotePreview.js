import React, { Component } from 'react';
import { withApiData } from '../with-api-data';
import marked from 'marked';
import LinkRenderer from '../link-renderer';
import MessageContent from './Message/Content';

let render = new marked.Renderer();
render.link = LinkRenderer;

class RemotePreview extends Component {
	state: {
		isFetching: false,
		compiledPreview: '',
	};

	componentWillMount() {
		this.onUpdateMarkdown();
	}

	onUpdateMarkdown() {
		const compiledMarkdown = marked( this.props.children, { renderer: render } );
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
