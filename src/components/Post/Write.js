import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import SelectDraft from './SelectDraft';
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
			draftId: null,
			title: '',
			initialContent: '',
			error: null,
			category: null,
			isSubmitting: false,
			isSaving: false,
			lastSave: null,
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

	getPostData( content, unprocessedContent ) {
		return {
			id: this.state.draftId || null,
			content,
			title: this.state.title,
			categories: this.state.category ? [ this.state.category ] : [],
			unprocessed_content: unprocessedContent,
		};
	}

	onSave = ( content, unprocessedContent ) => {
		this.setState( {
			isSaving: true,
			error: null,
		} );

		const body = this.getPostData( content, unprocessedContent );
		const url = body.id ? `/wp/v2/posts/${ body.id }` : '/wp/v2/posts';
		const method = body.id ? 'PUT' : 'POST';

		this.props.fetch( url, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method,
		} ).then( r => r.json().then( data => {
			if ( ! r.ok ) {
				this.setState( {
					isSaving: false,
					error: data,
				} );
				return;
			}

			this.setState( {
				draftId: data.id,
				initialContent: unprocessedContent,
				isSaving: false,
				lastSave: Date.now(),
			} );
			this.props.invalidateDataForUrl( '/wp/v2/posts?status=draft&context=edit' );
		} ) );
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
			...this.getPostData( content, unprocessedContent ),
			status: 'publish',
		};
		const url = body.id ? `/wp/v2/posts/${ body.id }` : '/wp/v2/posts';
		const method = body.id ? 'PUT' : 'POST';

		this.props.fetch( url, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method,
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
			this.props.invalidateDataForUrl( '/wp/v2/posts?status=draft&context=edit' );
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

	onSelect = draft => {
		if ( this.state.title !== '' || this.state.draftId !== null ) {
			const proceed = window.confirm( 'This will erase your current draft. Proceed?' );
			if ( ! proceed ) {
				return false;
			}
		}

		this.setState( {
			draftId: draft.id,
			title: draft.title.raw,
			initialContent: draft.unprocessed_content || draft.content.raw,
		} );
	}

	render() {
		const user = this.props.user.data;
		const categories = this.props.categories.data || [];
		return (
			<div className="WritePost" ref={ ref => this.container = ref }>
				<div className="WritePost__title">
					<h2>Write a New Post</h2>
					<SelectDraft
						user={ user || null }
						onSelect={ this.onSelect }
					/>
				</div>
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
					key={ this.state.draftId || '__none' }
					initialValue={ this.state.initialContent }
					lastSave={ this.state.lastSave }
					previewComponent={ props => <RemotePreview type="post" { ...props } /> }
					saveText={ this.state.isSaving ? 'Saving…' : 'Save' }
					submitText={ this.state.isSubmitting ? 'Publishing...' : 'Publish' }
					onCancel={ this.props.onCancel }
					onSave={ this.onSave }
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
	categories: '/wp/v2/categories?per_page=100',
} ) )( WritePost )
