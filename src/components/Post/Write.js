import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import RemotePreview from '../RemotePreview';
import { withApiData } from '../../with-api-data';
import { parseResponse } from '../../wordpress-rest-api-cookie-auth';

import Avatar from '../Avatar';
import Editor from '../Editor';
import Notification from '../Notification';

import './Write.css';

export class WritePost extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: '',
			error: null,
			category: null,
			isSubmitting: false,
		};
	}

	componentDidMount() {
		if ( this.container && this.titleInput ) {
			this.titleInput.focus();
			const node = ReactDOM.findDOMNode( this.container );
			if ( node && node.scrollIntoView ) {
				node.scrollIntoView( false );
			}
		}
	}
	onSubmit( content, unprocessedContent ) {
		if ( ! this.state.title ) {
			this.setState( { error: { message: 'Your post needs a title!' } } );
			return;
		}

		this.setState( {
			isSubmitting: true,
			error: null,
		} );

		const body = {
			content,
			status: 'publish',
			title: this.state.title,
			categories: this.state.category ? [ this.state.category ] : [],
			meta: { unprocessed_content: unprocessedContent },
		};

		this.props.fetch( '/wp/v2/posts', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json().then( data => {
			if ( ! r.ok ) {
				this.setState( {
					isSubmitting: false,
					error: data,
				} );
				return;
			}

			this.setState( {
				isSubmitting: true,
				title: '',
			} );
			this.props.invalidateDataForUrl( '/wp/v2/posts?page=1' );
			this.props.onDidCreatePost( data );
		} ) );
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
		const categories = this.props.categories.data || [];
		return (
			<div className="WritePost" ref={ ref => this.container = ref }>
				<header>
					<Avatar
						url={ user ? user.avatar_urls['96'] : '' }
						size={ 60 }
					/>
					<div className="byline">
						<h2>
							<input
								ref={ title => this.titleInput = title }
								type="text"
								placeholder="Enter post title..."
								required
								value={ this.state.title }
								onChange={ e => this.setState( { title: e.target.value } ) }
							/>
						</h2>
						<span className="date">
							{user ? user.name : ''}, now
						</span>
						{categories.length > 0 &&
							<select onChange={ e => this.setState( { category: e.target.value } ) } value={ this.state.cateogry } className="categories">
								<option key="none" value={ null }>- Category-</option>
								{ categories.map( category => (
									<option
										key={ category.id }
										value={ category.id }
									>
										{ category.name }
									</option>
								) ) }
							</select>
						}
					</div>
					<div className="actions"></div>
				</header>
				<Editor
					previewComponent={ props => <RemotePreview type="post" { ...props } /> }
					submitText={ this.state.isSubmitting ? 'Publishing...' : 'Publish' }
					onCancel={ this.props.onCancel }
					onSubmit={ ( ...args ) => this.onSubmit( ...args ) }
					onUpload={ ( ...args ) => this.onUpload( ...args ) }
				/>

				{ this.state.error && (
					<Notification type="error">
						Could not submit: { this.state.error.message }
					</Notification>
				) }

				{ this.props.children }
			</div>
		);
	}
}

WritePost.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onDidCreatePost: PropTypes.func.isRequired,
};

export default withApiData( props => ( {
	user: '/wp/v2/users/me',
	categories: '/wp/v2/categories',
} ) )( WritePost )
