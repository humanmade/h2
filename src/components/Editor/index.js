import countWords from '@iarna/word-count';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import getCaretCoordinates from 'textarea-caret';
import Turndown from 'turndown';

import compileMarkdown from '../../compile-markdown';
import { media } from '../../types';
import { cleanConvertedMarkdown, isBlockContent, isWordContent } from '../../util';
import Button from '../Button';
import DropUpload from '../DropUpload';
import MessageContent from '../Message/Content';
import Shortcuts from '../Shortcuts';

import EmojiCompletion from './EmojiCompletion';
import LazyInlineBlockEditor from './LazyInlineBlockEditor';
import MentionCompletion from './MentionCompletion';

const apply = ( selection, start, end ) => {
	return selection.length ? start + selection + end : start;
};

const URL_REGEX = /^https?:\/\/\S+$/i;
const isAbsoluteUrl = text => URL_REGEX.test( text );

const BUTTONS = {
	bold: {
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M6 4v13h4.54c1.37 0 2.46-.33 3.26-1 .8-.66 1.2-1.58 1.2-2.77 0-.84-.17-1.51-.51-2.01s-.9-.85-1.67-1.03v-.09c.57-.1 1.02-.4 1.36-.9s.51-1.13.51-1.91c0-1.14-.39-1.98-1.17-2.5C12.75 4.26 11.5 4 9.78 4H6zm2.57 5.15V6.26h1.36c.73 0 1.27.11 1.61.32.34.22.51.58.51 1.07 0 .54-.16.92-.47 1.15s-.82.35-1.51.35h-1.5zm0 2.19h1.6c1.44 0 2.16.53 2.16 1.61 0 .6-.17 1.05-.51 1.34s-.86.43-1.57.43H8.57v-3.38z"/></g></svg>',
		title: 'Add bold text',
		key: 'mod+b',
		apply: text => apply( text, '**', '**' ),
	},
	italic: {
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M14.78 6h-2.13l-2.8 9h2.12l-.62 2H4.6l.62-2h2.14l2.8-9H8.03l.62-2h6.75z"/></g></svg>',
		title: 'Add italic text',
		key: 'mod+i',
		apply: text => apply( text, '*', '*' ),
	},
	link: {
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M17.74 2.76c1.68 1.69 1.68 4.41 0 6.1l-1.53 1.52c-1.12 1.12-2.7 1.47-4.14 1.09l2.62-2.61.76-.77.76-.76c.84-.84.84-2.2 0-3.04-.84-.85-2.2-.85-3.04 0l-.77.76-3.38 3.38c-.37-1.44-.02-3.02 1.1-4.14l1.52-1.53c1.69-1.68 4.42-1.68 6.1 0zM8.59 13.43l5.34-5.34c.42-.42.42-1.1 0-1.52-.44-.43-1.13-.39-1.53 0l-5.33 5.34c-.42.42-.42 1.1 0 1.52.44.43 1.13.39 1.52 0zm-.76 2.29l4.14-4.15c.38 1.44.03 3.02-1.09 4.14l-1.52 1.53c-1.69 1.68-4.41 1.68-6.1 0-1.68-1.68-1.68-4.42 0-6.1l1.53-1.52c1.12-1.12 2.7-1.47 4.14-1.1l-4.14 4.15c-.85.84-.85 2.2 0 3.05.84.84 2.2.84 3.04 0z"/></g></svg>',
		title: 'Add link',
		apply: text => `[${ text || 'Text' }](https://)`,
	},
	sep1: { separator: true },
	quote: {
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M9.49 13.22c0-.74-.2-1.38-.61-1.9-.62-.78-1.83-.88-2.53-.72-.29-1.65 1.11-3.75 2.92-4.65L7.88 4c-2.73 1.3-5.42 4.28-4.96 8.05C3.21 14.43 4.59 16 6.54 16c.85 0 1.56-.25 2.12-.75s.83-1.18.83-2.03zm8.05 0c0-.74-.2-1.38-.61-1.9-.63-.78-1.83-.88-2.53-.72-.29-1.65 1.11-3.75 2.92-4.65L15.93 4c-2.73 1.3-5.41 4.28-4.95 8.05.29 2.38 1.66 3.95 3.61 3.95.85 0 1.56-.25 2.12-.75s.83-1.18.83-2.03z"/></g></svg>',
		title: 'Add blockquote',
		apply: text => apply( text, '>', '\n' ),
	},
	code: {
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M9 6l-4 4 4 4-1 2-6-6 6-6zm2 8l4-4-4-4 1-2 6 6-6 6z"/></g></svg>',
		title: 'Add code',
		apply: text =>
			( text.indexOf( '\n' ) > 0 ? apply( text, '```\n', '\n```\n' ) : apply( text, '`', '`' ) ),
	},
};

const navigateWarning = 'You have unsaved content. Are you sure you want to leave? Your content will not be saved.';
const convertWarning = 'Switching to the Markdown editor converts your blocks to Markdown, and some formatting may be lost. Continue?';

const TURNDOWN_OPTIONS = {
	headingStyle: 'atx',
	hr: '---',
	codeBlockStyle: 'fenced',
};

// Blocks offered in the inline (comment) editor. This mirrors what H2 allows
// in comment HTML.
const DEFAULT_ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/list-item',
	'core/quote',
	'core/code',
	'core/preformatted',
	'core/image',
	'core/separator',
];

const completions = {
	'@': MentionCompletion,
	':': EmojiCompletion,
};

const Preview = props => {
	const compiled = props.html !== undefined ? props.html : compileMarkdown( props.children );
	return (
		<div className="bg-white border-2 border-[#d9d9d9] p-4 mb-[1.66667rem]">
			<MessageContent html={ compiled } />
		</div>
	);
};
Preview.propTypes = {
	children: PropTypes.string,
	/** Ready-made HTML to show instead of compiling the Markdown children. */
	html: PropTypes.string,
};

const Tab = ( { checked, title, value, onSelect } ) => (
	<li>
		<label className="cursor-pointer">
			<input
				className="hidden peer"
				checked={ checked }
				name="Editor-mode"
				type="radio"
				value={ value }
				onChange={ e => onSelect( e.target.value ) }
			/>
			<span
				className="inline-block font-bold uppercase py-[7.5px] px-3 border-2 border-transparent border-b-0 rounded-t peer-checked:bg-white peer-checked:border-[#d9d9d9] peer-checked:text-hm-vibrant-blue"
			>
				{ title }
			</span>
		</label>
	</li>
);

const EditorButton = ( { icon, title, onSelect } ) => (
	<button
		className="group bg-transparent border-none font-[inherit] cursor-pointer p-1 -my-1 outline-hidden hover:text-[#00a0d2] focus:text-[#00a0d2]"
		onClick={ onSelect }
		title={ title }
		type="button"
	>
		<span
			className="block w-4 h-4 opacity-50 group-hover:opacity-100 group-focus:opacity-100"
			dangerouslySetInnerHTML={ { __html: icon } }
		/>
		<span className="screen-reader-text">{ title }</span>
	</button>
);

class Editor extends React.PureComponent {
	constructor( props ) {
		super( props );

		// Block content is stored as block markup; open that in the block editor.
		const startInBlocks = !! props.allowBlocks && isBlockContent( props.initialValue );

		this.state = {
			content: startInBlocks ? '' : props.initialValue,
			completion: null,
			count: countWords( startInBlocks ? props.initialValue.replace( /<[^>]*>/g, ' ' ) : ( props.initialValue || '' ) ),
			hasFocus: false,
			height: null,
			mode: startInBlocks ? 'blocks' : 'edit',
			uploading: [],

			// Which editor currently holds the content ('edit' or 'blocks'),
			// regardless of whether the preview is showing.
			editMode: startInBlocks ? 'blocks' : 'edit',

			// Block mode: what the block editor loads, its serialized output, and
			// the output it started from (for change tracking).
			blocksSource: startInBlocks ? props.initialValue : '',
			blocksHtml: startInBlocks ? props.initialValue : '',
			blocksInitialHtml: startInBlocks ? props.initialValue : '',
			blocksKey: 0,
		};
		this.textarea = null;
	}

	componentDidMount() {
		window.addEventListener( 'beforeunload', this.warnBeforeLeaving );
	}

	componentWillUnmount() {
		window.removeEventListener( 'beforeunload', this.warnBeforeLeaving );
	}

	warnBeforeLeaving = e => {
		if ( ! this.isDirty() ) {
			return;
		}

		e.returnValue = navigateWarning;
		return navigateWarning;
	}

	componentDidUpdate() {
		this.setState( state => {
			const text = state.editMode === 'blocks' ? state.blocksHtml.replace( /<[^>]*>/g, ' ' ) : state.content;

			return { count: countWords( text ) };
		} );

		if ( ! this.textarea ) {
			return;
		}

		// Recalculate height of the textarea, and grow to match content.
		const height = this.textarea.offsetHeight;
		const desired = this.textarea.scrollHeight;

		if ( desired > height ) {
			this.setState( { height: desired } );
		}
	}

	/**
	 * Whether there are changes which haven't been submitted.
	 *
	 * @returns {boolean} True if the content has changed.
	 */
	isDirty() {
		if ( this.state.editMode === 'blocks' ) {
			return this.state.blocksHtml !== this.state.blocksInitialHtml;
		}

		return ! ( this.state.content === '' || ( this.props.initialValue && this.state.content === this.props.initialValue ) );
	}

	/**
	 * Get the content to submit.
	 *
	 * Block content is stored as-is, with the block markup doubling as the
	 * editable source (kses may strip the delimiters from the rendered copy).
	 *
	 * @returns {string[]} Content and unprocessed content.
	 */
	getOutput() {
		if ( this.state.editMode === 'blocks' ) {
			return [ this.state.blocksHtml, this.state.blocksHtml ];
		}

		return [ compileMarkdown( this.state.content ), this.state.content ];
	}

	onSelectMode = mode => {
		const { editMode, mode: current } = this.state;
		if ( mode === current ) {
			return;
		}

		// Previewing, or returning from the preview, keeps the content where it is.
		if ( mode === 'preview' || mode === editMode ) {
			this.setState( { mode } );
			return;
		}

		if ( mode === 'blocks' ) {
			// Markdown to blocks; the block editor converts on load.
			this.setState( state => ( {
				mode,
				editMode: 'blocks',
				blocksSource: state.content,
				blocksHtml: '',
				blocksKey: state.blocksKey + 1,
			} ) );
			return;
		}

		// Blocks to Markdown, which is lossy.
		const html = this.state.blocksHtml;
		if ( html && ! window.confirm( convertWarning ) ) {
			return;
		}

		this.setState( {
			mode,
			editMode: 'edit',
			content: html ? cleanConvertedMarkdown( new Turndown( TURNDOWN_OPTIONS ).turndown( html ) ) : '',
		} );
	}

	updateTextarea( ref ) {
		if ( ref === this.textarea ) {
			return;
		}

		this.textarea = ref;
	}

	onKeyDown( e ) {
		const { key, target } = e;
		if ( ! completions[ key ] ) {
			if ( e.metaKey && e.key === 'Enter' ) {
				this.onSubmit( e );
				return false;
			}

			return;
		}

		// Only trigger if preceeded by whitespace.
		const shouldTrigger = !! target.value.substring( 0, target.selectionEnd ).match( /(^|\s)$/ );
		if ( ! shouldTrigger ) {
			return;
		}

		const coords = getCaretCoordinates( target, target.selectionEnd );
		const completion = {
			key,
			coords: {
				top: coords.top - target.scrollTop,
				left: coords.left - target.scrollLeft,
			},
			start: target.selectionEnd,
		};
		this.setState( { completion } );
	}

	onKeyUp( e ) {
		const { target } = e;
		const { completion } = this.state;

		// Is a completion open?
		if ( ! completion ) {
			return;
		}

		if ( target.selectionEnd === this.state.completion.start ) {
			// Outside completion, close it.
			this.setState( { completion: null } );
		} else {
			this.setState( {
				completion: {
					...this.state.completion,
					end: target.selectionEnd,
				},
			} );
		}
	}

	onPaste = e => {
		const html = e.clipboardData.getData( 'text/html' );
		if ( ! html || ! isWordContent( html ) ) {
			const text = e.clipboardData.getData( 'text/plain' );
			if ( isAbsoluteUrl( text ) ) {
				e.preventDefault();
				this.onPasteLink( text );
				return;
			}

			// Use default browser handling.
			return;
		}

		e.preventDefault();

		// Convert HTML content to Markdown
		const turndown = new Turndown( {
			headingStyle: 'atx',
			hr: '---',
			codeBlockStyle: 'fenced',
		} );
		const markdown = cleanConvertedMarkdown( turndown.turndown( html ) );

		// Insert at the current selection point
		this.onButton( null, () => markdown );
	}

	onPasteLink( url ) {
		this.onButton( null, text => {
			if ( ! text ) {
				return url;
			}

			// If we're replacing an existing link, don't format.
			if ( text.match( /^https?:\/\/\S*$/ ) ) {
				return url;
			}

			return `[${ text }](${ url })`;
		} );
	}

	onSubmit( e ) {
		e.preventDefault();

		this.props.onSubmit( ...this.getOutput() );
	}

	onSave = () => {
		this.props.onSave( ...this.getOutput() );
	}

	onBlur() {
		const { selectionStart, selectionEnd } = this.textarea;

		const lastSelection = [ selectionStart, selectionEnd ];

		this.setState( {
			lastSelection,
			hasFocus: false,
		} );
	}

	onFocus() {
		this.setState( {
			lastSelection: null,
			hasFocus: true,
		} );
	}

	onButton( e, apply ) {
		e && e.preventDefault();

		this.setState(
			state => {
				let { selectionStart, selectionEnd } = this.textarea;
				if ( state.lastSelection ) {
					[ selectionStart, selectionEnd ] = state.lastSelection;
				}
				const content = state.content;

				const current = content.substring( selectionStart, selectionEnd );
				const next = apply( current );

				// Adjust cursor.
				const nextEnd = selectionEnd + ( next.length - current.length );
				const nextStart = selectionStart === selectionEnd ? nextEnd : selectionStart;

				const nextParts = [
					content.substring( 0, selectionStart ),
					next,
					content.substring( selectionEnd ),
				];

				return {
					content: nextParts.join( '' ),
					lastSelection: [
						nextStart,
						nextEnd,
					],
				};
			},
			this.restoreSelection
		);
	}

	restoreSelection = () => {
		// Force the selection back.
		const [ selectionStart, selectionEnd ] = this.state.lastSelection;
		if ( this.textarea ) {
			this.textarea.selectionStart = selectionStart;
			this.textarea.selectionEnd = selectionEnd;
			this.focus();
			this.setState( { lastSelection: null } );
		}
	}

	onUpload( files ) {
		this.setState( state => ( { uploading: [ ...state.uploading, ...files ] } ) );

		// Start uploads and build placeholder array.
		const placeholders = files.map( file => {
			const placeholder = `<img alt="Uploading ${ file.name }…" />`;

			this.props.onUpload( file ).then( id => {
				const data = media.getSingle( this.props.media, id );
				this.setState( state => {
					const content = state.content.replace(
						placeholder,
						`<img alt="${ data.title.raw }" src="${ data.source_url }" />`
					);

					const nextUploading = state.uploading.filter( item => item !== file );

					return {
						content,
						uploading: nextUploading,
					};
				} );
			} );

			return placeholder;
		} );

		// Insert placeholders into the text
		this.onButton( null, () => `\n${ placeholders.join( '\n' ) }\n` );
	}

	getCompletion() {
		const { completion, content } = this.state;

		if ( ! completion ) {
			return null;
		}

		const completionProps = {
			key: completion.key,
			coords: completion.coords,
			text: content.substring( completion.start + 1, completion.end ),
			trigger: completion.key,
			onSelect: val => {
				const content = this.state.content;
				const before = content.substring( 0, completion.start );

				const nextParts = [
					before,
					val,
					content.substring( completion.end ),
				];
				const nextCursor = before.length + val.length;

				this.setState(
					{
						completion: null,
						content: nextParts.join( '' ),
						lastSelection: [ nextCursor, nextCursor ],
					},
					this.restoreSelection
				);
			},
			onCancel: () => this.setState( { completion: null } ),
		};

		const Handler = completions[ completion.key ];
		if ( ! Handler ) {
			return null;
		}
		return <Handler { ...completionProps } />;
	}

	onChangeBlocks = html => {
		this.setState( { blocksHtml: html } );
	}

	focus() {
		if ( ! this.textarea ) {
			return;
		}

		this.textarea.focus();
	}

	render() {
		const { content, count, editMode, hasFocus, height, mode } = this.state;

		const shortcuts = {};
		Object.keys( BUTTONS ).forEach( buttonType => {
			const button = BUTTONS[ buttonType ];
			if ( ! button.key ) {
				return;
			}

			shortcuts[ button.key ] = {
				allowInInput: true,
				callback: e => this.onButton( e, button.apply ),
			};
		} );

		const PreviewComponent = this.props.previewComponent || Preview;

		const isPreviewing = mode === 'preview';

		return (
			<form
				className={ [
					'pb-7',
					this.props.className,
				].filter( Boolean ).join( ' ' ) }
				onSubmit={ e => this.onSubmit( e ) }
			>
				<Shortcuts keys={ hasFocus ? shortcuts : null } />

				<div className="flex justify-between -mb-[2px] z-2 relative text-[#504C4C]">
					<ul className="flex tracking-[0.01em] text-xs">
						<Tab
							title="Write"
							value="edit"
							checked={ mode === 'edit' }
							onSelect={ this.onSelectMode }
						/>
						<Tab
							title="Preview"
							value="preview"
							checked={ mode === 'preview' }
							onSelect={ this.onSelectMode }
						/>
						{ this.props.allowBlocks && (
							<Tab
								title="Blocks"
								value="blocks"
								checked={ mode === 'blocks' }
								onSelect={ this.onSelectMode }
							/>
						) }
						{ this.props.onSwitchToBlocks && (
							<li>
								<button
									className="inline-block font-bold uppercase py-[7.5px] px-3 border-2 border-transparent border-b-0 rounded-t bg-transparent cursor-pointer hover:text-hm-vibrant-blue"
									title="Switch to the block editor"
									type="button"
									onClick={ () => this.props.onSwitchToBlocks( this.state.content ) }
								>
									Blocks
								</button>
							</li>
						) }
					</ul>

					{ mode === 'edit' ? (
						<ul className="flex list-none p-0 m-0 text-xs">
							{ Object.keys( BUTTONS ).map( type => {
								if ( BUTTONS[ type ].separator ) {
									return (
										<span
											key={ type }
											className="hidden ml-2"
										/>
									);
								}

								return (
									<EditorButton
										key={ type }
										icon={ BUTTONS[ type ].icon }
										title={ BUTTONS[ type ].title }
										onSelect={ e => this.onButton( e, BUTTONS[type].apply ) }
									/>
								);
							} ) }
						</ul>
					) : null }
				</div>

				<div className="relative text-lg">
					{ editMode === 'blocks' && (
						// Stays mounted while previewing so edits and history survive.
						<div className={ mode === 'preview' ? 'hidden' : undefined }>
							<LazyInlineBlockEditor
								key={ this.state.blocksKey }
								allowedBlocks={ this.props.allowedBlocks || DEFAULT_ALLOWED_BLOCKS }
								initialContent={ this.state.blocksSource }
								onChange={ this.onChangeBlocks }
							/>
						</div>
					) }
					{ mode !== 'blocks' && (
						<DropUpload
							allowMultiple
							className="mb-4"
							statusClassName={ isPreviewing ? 'hidden' : 'border-2 border-[#d9d9d9] [border-top-style:dashed] rounded-bl rounded-br py-[0.2em] px-[9px] bg-hm-light-grey' }
							files={ this.state.uploading }
							onUpload={ file => this.onUpload( file ) }
						>
							{ mode === 'preview' && editMode === 'blocks' ? (
								<PreviewComponent html={ this.state.blocksHtml || '<p><em>Nothing to preview</em></p>' } />
							) : mode === 'preview' ? (
								<PreviewComponent>{ content || '*Nothing to preview*' }</PreviewComponent>
							) : (
								<textarea
									ref={ el => this.updateTextarea( el ) }
									className="Editor-editor min-h-72 max-h-120 resize-y rounded-none rounded-tr border-2 border-b-0 border-[#d9d9d9] bg-white pt-4 pb-4 block px-[15px] w-full focus:outline-hidden placeholder:italic"
									placeholder="Write a comment..."
									style={ { height } }
									value={ content }
									onBlur={ () => this.onBlur() }
									onFocus={ () => this.onFocus() }
									onChange={ e => this.setState( { content: e.target.value } ) }
									onKeyDown={ e => this.onKeyDown( e ) }
									onKeyUp={ e => this.onKeyUp( e ) }
									onPaste={ this.onPaste }
								/>
							) }
						</DropUpload>
					) }
					<Prompt
						when={ ! this.props.isSubmitting && this.isDirty() }
						message={ navigateWarning }
					/>

					{ mode === 'edit' ? this.getCompletion() : null }
				</div>

				<p className="pl-2 m-0 flex justify-between items-center">
					<small>
						<span>{ count === 1 ? '1 word' : `${ count.toLocaleString() } words` }</span>
						<br />
						<a
							className="text-hm-vibrant-blue hover:underline"
							href="http://commonmark.org/help/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Format with Markdown ↗
						</a>
						{ this.props.lastSave && (
							<React.Fragment>
								<br />
								{ 'Last saved ' }
								<FormattedRelative value={ this.props.lastSave } />
							</React.Fragment>
						) }
					</small>
					<span>
						{ this.props.onCancel ? (
							<Button
								className="mb-0"
								onClick={ this.props.onCancel }
							>
								Cancel
							</Button>
						) : null }
						{ this.props.onSave && (
							<Button
								className="mb-0"
								onClick={ this.onSave }
							>
								{ this.props.saveText || 'Save' }
							</Button>
						) }
						<Button
							className="mb-0"
							submit type="primary"
						>
							{ this.props.submitText }
						</Button>
					</span>
				</p>
			</form>
		);
	}
}

Editor.defaultProps = {
	initialValue: '',
	submitText: 'Comment',
};

Editor.propTypes = {
	/** Offer a Blocks tab with the inline block editor (comments). */
	allowBlocks: PropTypes.bool,
	/** Blocks available in the inline block editor. */
	allowedBlocks: PropTypes.arrayOf( PropTypes.string ),
	className: PropTypes.string,
	/** While true, navigating away (e.g. after publishing) won't prompt. */
	isSubmitting: PropTypes.bool,
	previewComponent: PropTypes.func,
	saveText: PropTypes.string,
	submitText: PropTypes.string,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	/** When set, offers a switch to the block editor with the current content. */
	onSwitchToBlocks: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		media: state.media,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onUpload: file => dispatch( media.uploadSingle( file ) ),
	};
};

const ConnectedEditor = connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		withRef: true,
	}
)( Editor );
ConnectedEditor.prototype.focus = function () {
	// Pass through focus()
	this.getWrappedInstance().focus();
};
export default ConnectedEditor;
