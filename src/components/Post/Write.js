import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { withCategories, withCurrentUser } from '../../hocs';
import { posts } from '../../types';
import Avatar from '../Avatar';
import Editor from '../Editor/LazyEditor';
import Notification from '../Notification';
import RemotePreview from '../RemotePreview';

import SelectDraft from './SelectDraft';

const WRAP_CLASSES = [
	// Back-compat:
	'WritePost',

	'flex-col relative py-6 m-0',
	'border-b border-hm-beige',

	// Notification child.
	'[&>.Notification]:ml-16 [&>.Notification]:-mt-[1.36667rem]',
].join( ' ' );

export class WritePost extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			draftId: null,
			deletingDraftId: null,
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
			.then( () => {
				this.props.onDidCreatePost();
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

	onTrashDraft = async id => {
		if ( this.state.deletingDraftId || this.state.isSaving || this.state.isSubmitting ) {
			return false;
		}
		if ( ! window.confirm( 'Move this draft to Trash? Any unsaved changes to this draft will be discarded.' ) ) {
			return false;
		}

		this.setState( {
			deletingDraftId: id,
			error: null,
		} );
		try {
			const deletedId = await this.props.onDelete( id );
			if ( ! deletedId ) {
				throw new Error( 'Could not move the draft to Trash. Please try again.' );
			}
			if ( this.state.draftId === id ) {
				this.setState( {
					draftId: null,
					title: '',
					initialContent: '',
					category: null,
					lastSave: null,
				} );
			}
			return true;
		} catch ( error ) {
			this.setState( { error } );
			return false;
		} finally {
			this.setState( { deletingDraftId: null } );
		}
	}

	render() {
		const user = this.props.currentUser;
		const categories = this.props.categories.data || [];
		return (
			<div className={ WRAP_CLASSES } ref={ ref => this.container = ref }>
				<div
					className="flex flex-wrap justify-between items-center gap-x-3 border-b border-hm-beige pb-4 [&_.btn]:m-0"
				>
					<h2 className="text-xl leading-7 font-semibold normal-case m-0">
						New post
					</h2>
					<SelectDraft
						deletingDraftId={ this.state.deletingDraftId }
						isBusy={ this.state.isSaving || this.state.isSubmitting || this.state.deletingDraftId !== null }
						onTrash={ this.onTrashDraft }
						user={ user || null }
						onSelect={ this.onSelect }
					/>
				</div>
				<header className="relative py-6 bg-white flex items-start">
					<Avatar
						className="mr-4 shrink-0 max-[600px]:hidden"
						url={ user ? user.avatar_urls['96'] : '' }
						size={ 48 }
					/>
					<div className="byline flex-col grow min-w-0">
						<h2 className="text-2xl leading-7 font-semibold m-0 mb-2">
							<input
								className="block w-full px-3 py-2 border border-hm-border-color rounded-md bg-white text-2xl leading-7 font-semibold placeholder:font-normal placeholder:text-gray-400 focus:outline-hidden focus:border-hm-vibrant-blue"
								ref={ title => this.titleInput = title }
								type="text"
								aria-label="Post title"
								placeholder="Post title"
								required
								value={ this.state.title }
								onChange={ e => this.setState( { title: e.target.value } ) }
							/>
						</h2>
						<span className="date text-gray-500 text-sm">
							{ user ? user.name : '' }, now
						</span>
						{ categories.length > 0 && (
							<select
								aria-label="Category"
								className="categories text-sm text-gray-600 ml-3 px-2 py-1 border border-hm-border-color rounded-md bg-white"
								onChange={ e => this.setState( { category: e.target.value } ) }
								value={ this.state.category }
							>
								<option key="none" value={ null }>Category</option>
								{ categories.map( category => (
									<option
										key={ category.id }
										value={ category.id }
									>
										{ category.name }
									</option>
								) ) }
							</select>
						) }
					</div>
					<div className="actions"></div>
				</header>
				<Editor
					key={ this.state.draftId || '__none' }
					className="ml-16 max-[600px]:ml-0 pb-0!"
					initialValue={ this.state.initialContent }
					placeholder="Write your post…"
					lastSave={ this.state.lastSave }
					footerDetails={ this.state.draftId ? (
						<a
							className="text-hm-vibrant-blue hover:underline"
							href={ this.getDraftUrl() }
							rel="noopener noreferrer"
							target="_blank"
						>
							Preview draft ↗
						</a>
					) : null }
					previewComponent={ props => <RemotePreview type="post" { ...props } /> }
					saveText={ this.state.isSaving ? 'Saving…' : 'Save' }
					isSubmitting={ this.state.isSubmitting || this.state.isSaving || this.state.deletingDraftId !== null }
					submitText={ this.state.isSubmitting ? 'Publishing...' : 'Publish' }
					onCancel={ this.props.onCancel }
					onDelete={ this.state.draftId ? () => this.onTrashDraft( this.state.draftId ) : undefined }
					deleteText={ this.state.deletingDraftId ? 'Moving to Trash…' : 'Move to Trash' }
					onSave={ this.onSave }
					onSubmit={ ( ...args ) => this.onSubmit( ...args ) }
				/>

				{ this.state.error && (
					<Notification type="error">
						{ this.state.error.message }
					</Notification>
				) }

				{ this.props.children }
			</div>
		);
	}
}

WritePost.propTypes = {
	onCancel: PropTypes.func,
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
		onDelete: id => dispatch( posts.deleteSingle( id ) ),
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
