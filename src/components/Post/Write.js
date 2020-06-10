import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import SelectDraft from './SelectDraft';
import RemotePreview from '../RemotePreview';
import { withCategories, withCurrentUser } from '../../hocs';
import { posts } from '../../types';

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
			didCopy: false,
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
			categories: this.state.category ? [ this.state.category ] : undefined,
			unprocessed_content: unprocessedContent,
		};
	}

	getDraftUrl() {
		return `${ window.H2Data.site.url.replace( /([^/])$/, '$1/' ) }?p=${ this.state.draftId }&preview=true`;
	}

	onSave = ( content, unprocessedContent ) => {
		this.setState( {
			isSaving: true,
			error: null,
		} );

		const body = this.getPostData( content, unprocessedContent );

		const onDoSave = body.id ? this.props.onUpdate : this.props.onCreate;
		onDoSave( body )
			.then( id => {
				// const data = posts.getSingle( this.props.posts, id );

				this.setState( {
					draftId: id,
					initialContent: unprocessedContent,
					isSaving: false,
					lastSave: Date.now(),
				} );
			} )
			.catch( error => {
				this.setState( {
					isSaving: false,
					error,
				} );
			} );
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

		const onDoSave = body.id ? this.props.onUpdate : this.props.onCreate;
		onDoSave( body )
			.then( id => {
				const data = posts.getSingle( this.props.posts, id );
				this.props.onDidCreatePost( data );
			} )
			.catch( error => {
				this.setState( {
					isSubmitting: false,
					error,
				} );
			} );
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

	onClickPreview = e => {
		e.preventDefault();
		const input = e.target;
		input.select();
		document.execCommand( 'copy' );

		// Show copy indicator, and hide after 1 second.
		this.setState( { didCopy: true } );
		window.setTimeout( () => this.setState( { didCopy: false } ), 1000 );
	}

	render() {
		const user = this.props.currentUser;
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
							{ user ? user.name : '' }, now
						</span>
						{ categories.length > 0 &&
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
							</select> }
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
				/>

				{ this.state.error && (
					<Notification type="error">
						Could not submit: { this.state.error.message }
					</Notification>
				) }

				{ this.state.draftId && (
					<p className="WritePost__preview-link">
						Preview URL:
						<input
							className="form__field--code"
							type="text"
							value={ this.getDraftUrl() }
							onClick={ this.onClickPreview }
							onMouseOver={ e => e.target.select() }
						/>

						<span
							className={ `WritePost__preview-copied ${ this.state.didCopy ? 'active' : '' } ` }
						>
							Copied!
						</span>
					</p>
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

const mapStateToProps = state => {
	return {
		posts: state.posts,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCreate: data => dispatch( posts.createSingle( data ) ),
		onUpdate: data => dispatch( posts.updateSingle( data ) ),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withCategories(
		withCurrentUser( WritePost )
	)
);
