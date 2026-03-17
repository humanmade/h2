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
				<header className="sticky top-0 z-[3] py-[15px] bg-white flex items-center h-[110px]">
					<Avatar
						className="mr-[30px] max-[600px]:hidden"
						url={ user ? user.avatar_urls['96'] : '' }
						size={ 60 }
					/>
					<div className="byline flex-col grow">
						<h2 className="m-0 leading-6">
							<input
								className="p-[0.2em] w-full border-solid border-2 border-[rgba(217,217,217,0.6)] focus:outline-none focus:border-[#8d8d8d] placeholder:text-[rgba(80,76,76,.5)]"
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
								className="categories list-none m-0 ml-[10px] p-0 inline text-sm"
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
					key={ this.state.draftId || '__none' }
					className="ml-[90px] max-[600px]:ml-0"
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
					<p className="ml-[90px] -mt-5 mb-[1em] px-[5px] text-[0.777777778em]">
						Preview URL:
						<input
							className="form__field--code inline-block bg-hm-light-grey px-[5px] py-0 mx-[1em] my-0 border-none text-[inherit]"
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
