import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { withApiData } from '../with-api-data';
import { parseResponse } from '../wordpress-rest-api-cookie-auth';

import Avatar from './Avatar';
import Editor from './Editor';

import './WritePost.css';

export class WritePost extends Component {
	onSubmit( content ) {
		const body = {
			content,
			status: 'publish',
		};

		this.props.fetch( '/wp/v2/posts', {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json() ).then( post  => {
			this.props.invalidateDataForUrl( '/wp/v2/posts?page=1' );
			this.props.onWrotePost( post )
		} );
	}
	onUpload( file ) {
		const options = { method: 'POST' };
		options.body = new FormData();
		options.body.append( 'file', file );

		return this.props.fetch( '/wp/v2/media', options )
			.then( parseResponse );
	}
	render() {
		const user = this.props.user.data;
		return <div className="WritePost">
			<header>
				<Avatar
					url={user ? user.avatar_urls['96'] : ''}
					size={70}
				/>
				<div className="byline">
					<h2 dangerouslySetInnerHTML={{ __html: 'New Post' }} />
					<div className="date">
						{user ? user.name : ''}, now
					</div>
				</div>
				<div className="actions"></div>
			</header>
			<Editor
				submitText="Publish"
				onCancel={this.props.onCancel}
				onSubmit={( ...args ) => this.onSubmit( ...args )}
				onUpload={( ...args ) => this.onUpload( ...args )}
			/>
			{this.props.children}
		</div>
	}
}

WritePost.propTypes = {
	onCancel:    PropTypes.func.isRequired,
	onWrotePost: PropTypes.func.isRequired,
};

export default withApiData( props => ( { user: '/wp/v2/users/me' } ) )( WritePost )
