import React, { Component } from 'react';
import { withApiData } from '../with-api-data';
import marked from 'marked';
import LinkRenderer from '../link-renderer';
import PostContent from './PostContent';

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
		const compiledMarkedown = marked( this.props.children, { renderer: render } );
		this.setState( {
			compiledPreview: compiledMarkedown,
			isFetching:      true,
		} );
		const body = { html: compiledMarkedown };
		this.props.fetch( '/h2/v1/preview', {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} )
			.then( r => r.json() )
			.then( response => {
				this.setState( {
					compiledPreview: response.html,
					isFetching:      false,
				} );
			} );
	}
	render() {
		return <div className="Editor-preview">
			<PostContent html={ this.state.compiledPreview } />
		</div>
	}
}

export default withApiData( () => ( {} ) )( RemotePreview );
