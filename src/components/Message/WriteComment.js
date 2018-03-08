import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Avatar from '../Avatar';
import Editor from '../Editor';
import { withApiData } from '../../with-api-data';
import { parseResponse } from '../../wordpress-rest-api-cookie-auth';
import { Post } from '../../shapes';

import './WriteComment.css';

class WriteComment extends React.Component {
	componentDidMount() {
		if ( this.container && this.editor ) {
			this.editor.focus();
			const node = ReactDOM.findDOMNode( this.container );
			if ( node && node.scrollIntoView ) {
				node.scrollIntoView( false );
			}
		}
	}

	onUpload( file ) {
		const options = { method: 'POST' };
		options.body = new FormData();
		options.body.append( 'file', file );

		return this.props.fetch( '/wp/v2/media', options )
			.then( parseResponse );
	}

	onSubmit( content ) {
		const body = {
			content,
			post: this.props.parentPost.id,
		};

		if ( this.props.comment ) {
			body.parent = this.props.comment.id;
		}

		this.props.fetch( '/wp/v2/comments', {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} ).then( this.props.onDidCreateComment );
	}

	render() {
		return <div className="WriteComment" ref={ ref => this.container = ref }>
			<header>
				<Avatar
					url={this.props.user.data ? this.props.user.data.avatar_urls['96'] : ''}
					user={this.props.user.data}
					size={40}
				/>
				<strong>{this.props.user.data ? this.props.user.data.name : ''}</strong>
			</header>
			<div className="body">
				<Editor
					ref={editor => this.editor = editor}
					onCancel={this.props.onCancel}
					onSubmit={( ...args ) => this.onSubmit( ...args )}
					onUpload={( ...args ) => this.onUpload( ...args )}
				/>
			</div>
		</div>;
	}
}

WriteComment.propTypes = {
	parentPost:     Post.isRequired,
	onCancel:       PropTypes.func.isRequired,
	onDidCreateComment: PropTypes.func.isRequired,
};

export default withApiData( props => ( { user: '/wp/v2/users/me' } ) )( WriteComment )
