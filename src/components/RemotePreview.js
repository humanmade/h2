import PropTypes from 'prop-types';
import React from 'react';

import compileMarkdown from '../compile-markdown';

import MessageContent from './Message/Content';
import Notification from './Notification';

export default class RemotePreview extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			compiledPreview: '',
			error: null,
			isLoading: true,
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

		fetch( `${ window.wpApiSettings.root }h2/v1/preview`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
		} )
			.then( response => response.json() )
			.then( response => {
				this.setState( {
					compiledPreview: response.html,
					isLoading: false,
				} );
			} )
			.catch( err =>  {
				this.setState( {
					isLoading: false,
					error: err.message,
				} );
			} );
	}

	render() {
		if ( this.state.isLoading ) {
			return <Notification>Loading…</Notification>;
		}

		if ( this.state.error ) {
			return <Notification type="error">Could not load preview: { this.state.error }</Notification>;
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
