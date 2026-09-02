import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { withCategories, withCurrentUser } from '../../hocs';
import { posts } from '../../types';
import { isBlockContent } from '../../util';
import Avatar from '../Avatar';
import Editor from '../Editor/LazyEditor';
import Notification from '../Notification';
import RemotePreview from '../RemotePreview';

import LazyBlockEditor from './LazyBlockEditor';
import SelectDraft from './SelectDraft';

const WRAP_CLASSES = [
	// Back-compat:
	'WritePost',

	'flex-col relative pb-5 mb-[35px] min-h-[144px]',
	'border-b-[5px] border-[#F1F2EE]',

	// Notification child.
	'[&>.Notification]:ml-[90px] [&>.Notification]:-mt-[1.36667rem]',
].join( ' ' );

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

			// Which editor is in use: 'markdown' or 'blocks'.
			editor: 'markdown',

			// Bumped whenever the editor should start afresh (e.g. loading a draft).
			editorKey: 0,
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
			.then( post => {
				this.setState( {
					draftId: post.id,
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
			.then( post => {
				this.props.onDidCreatePost( post );
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

		// Open the draft in whichever editor matches its content.
		const content = draft.unprocessed_content || draft.content.raw;
		this.setState( state => ( {
			draftId: draft.id,
			title: draft.title.raw,
			initialContent: content,
			editor: isBlockContent( content ) ? 'blocks' : 'markdown',
			editorKey: state.editorKey + 1,
		} ) );
	}

	onSwitchToBlocks = content => {
		this.setState(
			{
				editor: 'blocks',
				initialContent: content,
			},
			this.scrollEditorIntoView
		);
	}

	onSwitchToMarkdown = content => {
		this.setState( {
			editor: 'markdown',
			initialContent: content,
		} );
	}

	scrollEditorIntoView = () => {
		if ( this.container && this.container.scrollIntoView ) {
			this.container.scrollIntoView( true );
		}
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

		if ( this.state.editor === 'blocks' ) {
			// The block editor takes over the whole main column; see App.css.
			return (
				<div
					className="PostBlockEditor flex flex-col bg-white"
					ref={ ref => this.container = ref }
				>
					<LazyBlockEditor
						key={ this.state.editorKey }
						categories={ categories }
						category={ this.state.category }
						draftUrl={ this.state.draftId ? this.getDraftUrl() : null }
						error={ this.state.error }
						initialContent={ this.state.initialContent }
						isSaving={ this.state.isSaving }
						isSubmitting={ this.state.isSubmitting }
						lastSave={ this.state.lastSave }
						title={ this.state.title }
						user={ user || null }
						onCancel={ this.props.onCancel }
						onChangeCategory={ category => this.setState( { category } ) }
						onChangeTitle={ title => this.setState( { title } ) }
						onSave={ this.onSave }
						onSelectDraft={ this.onSelect }
						onSubmit={ ( ...args ) => this.onSubmit( ...args ) }
						onSwitchToMarkdown={ this.onSwitchToMarkdown }
					/>
				</div>
			);
		}

		return (
			<div className={ WRAP_CLASSES } ref={ ref => this.container = ref }>
				<div
					className="flex justify-between items-baseline border-solid border-0 border-b-2 border-hm-beige py-[0.5em] [&_.btn]:m-0 [&_.btn_.label\_\_count]:ml-[0.5em] [&_.btn_.label\_\_count]:-mt-[3px] [&_.btn:hover_.label\_\_count]:bg-white [&_.btn:hover_.label\_\_count]:text-hm-vibrant-blue"
				>
					<h2 className="text-[1.5em] leading-[1.4] normal-case m-0">
						Write a New Post
					</h2>
					<SelectDraft
						user={ user || null }
						onSelect={ this.onSelect }
					/>
				</div>
				<header className="sticky top-0 z-3 py-[15px] bg-white flex items-center h-[110px]">
					<Avatar
						className="mr-[30px] max-[600px]:hidden"
						url={ user ? user.avatar_urls['96'] : '' }
						size={ 60 }
					/>
					<div className="byline flex-col grow">
						<h2 className="text-2xl leading-7 font-bold">
							<input
								className="p-[0.2em] w-full border-solid border-2 border-[rgba(217,217,217,0.6)] focus:outline-hidden focus:border-[#8d8d8d] placeholder:text-[rgba(80,76,76,.5)]"
								ref={ title => this.titleInput = title }
								type="text"
								placeholder="Enter post title..."
								required
								value={ this.state.title }
								onChange={ e => this.setState( { title: e.target.value } ) }
							/>
						</h2>
						<span className="date text-[#AAA] text-sm">
							{ user ? user.name : '' }, now
						</span>
						{ categories.length > 0 && (
							<select
								className="categories text-sm ml-[10px] px-1 border border-hm-border-color rounded-xs"
								onChange={ e => this.setState( { category: e.target.value } ) }
								value={ this.state.category }
							>
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
						) }
					</div>
					<div className="actions"></div>
				</header>
				<Editor
					key={ this.state.editorKey }
					className="ml-[90px] max-[600px]:ml-0"
					initialValue={ this.state.initialContent }
					isSubmitting={ this.state.isSubmitting }
					lastSave={ this.state.lastSave }
					previewComponent={ props => <RemotePreview type="post" { ...props } /> }
					saveText={ this.state.isSaving ? 'Saving…' : 'Save' }
					submitText={ this.state.isSubmitting ? 'Publishing...' : 'Publish' }
					onCancel={ this.props.onCancel }
					onSave={ this.onSave }
					onSubmit={ ( ...args ) => this.onSubmit( ...args ) }
					onSwitchToBlocks={ this.onSwitchToBlocks }
				/>

				{ this.state.error && (
					<Notification type="error">
						Could not submit: { this.state.error.message }
					</Notification>
				) }

				{ this.state.draftId && (
					<p className="ml-[90px] -mt-5 mb-[1em] px-[5px] text-[0.777777778em]">
						Preview URL:
						<input
							className="form__field--code inline-block bg-hm-light-grey px-[5px] py-0 mx-[1em] my-0 border-none text-inherit"
							type="text"
							value={ this.getDraftUrl() }
							onClick={ this.onClickPreview }
							onMouseOver={ e => e.target.select() }
						/>

						<span
							className={ `transition-opacity duration-100 ${ this.state.didCopy ? 'opacity-100' : 'opacity-0' }` }
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
	onCancel: PropTypes.func,
	onDidCreatePost: PropTypes.func.isRequired,
};

// Resolve with the saved post, read from the store as soon as the request
// completes. Reading it back from props instead would race React's batched
// re-render, which may not have happened yet when the promise resolves.
const savePost = ( action, data ) => ( _, getState ) => (
	action( data ).then( id => {
		const post = posts.getSingle( getState().posts, id );
		if ( ! post ) {
			throw new Error( 'The post was saved, but could not be loaded.' );
		}
		return post;
	} )
);

const mapDispatchToProps = dispatch => {
	return {
		onCreate: data => dispatch( savePost( body => dispatch( posts.createSingle( body ) ), data ) ),
		onUpdate: data => dispatch( savePost( body => dispatch( posts.updateSingle( body ) ), data ) ),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(
	withCategories(
		withCurrentUser( WritePost )
	)
);
