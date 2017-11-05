import { emojiIndex } from 'emoji-mart';
import marked from 'marked';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Button from './Button';
import DropUpload from './DropUpload';

import './Editor.css';

const apply = ( selection, start, end ) => {
	return selection.length ? start + selection + end : start;
};

const BUTTONS = {
	bold: {
		icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M6 4v13h4.54c1.37 0 2.46-.33 3.26-1 .8-.66 1.2-1.58 1.2-2.77 0-.84-.17-1.51-.51-2.01s-.9-.85-1.67-1.03v-.09c.57-.1 1.02-.4 1.36-.9s.51-1.13.51-1.91c0-1.14-.39-1.98-1.17-2.5C12.75 4.26 11.5 4 9.78 4H6zm2.57 5.15V6.26h1.36c.73 0 1.27.11 1.61.32.34.22.51.58.51 1.07 0 .54-.16.92-.47 1.15s-.82.35-1.51.35h-1.5zm0 2.19h1.6c1.44 0 2.16.53 2.16 1.61 0 .6-.17 1.05-.51 1.34s-.86.43-1.57.43H8.57v-3.38z"/></g></svg>',
		title: 'Add bold text',
		apply: text => apply( text, '**', '**' ),
	},
	italic: {
		icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M14.78 6h-2.13l-2.8 9h2.12l-.62 2H4.6l.62-2h2.14l2.8-9H8.03l.62-2h6.75z"/></g></svg>',
		title: 'Add italic text',
		apply: text => apply( text, '*', '*' ),
	},
	sep1:  { separator: true },
	quote: {
		icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M9.49 13.22c0-.74-.2-1.38-.61-1.9-.62-.78-1.83-.88-2.53-.72-.29-1.65 1.11-3.75 2.92-4.65L7.88 4c-2.73 1.3-5.42 4.28-4.96 8.05C3.21 14.43 4.59 16 6.54 16c.85 0 1.56-.25 2.12-.75s.83-1.18.83-2.03zm8.05 0c0-.74-.2-1.38-.61-1.9-.63-.78-1.83-.88-2.53-.72-.29-1.65 1.11-3.75 2.92-4.65L15.93 4c-2.73 1.3-5.41 4.28-4.95 8.05.29 2.38 1.66 3.95 3.61 3.95.85 0 1.56-.25 2.12-.75s.83-1.18.83-2.03z"/></g></svg>',
		title: 'Add blockquote',
		apply: text => apply( text, '>', '\n' ),
	},
	code: {
		icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M9 6l-4 4 4 4-1 2-6-6 6-6zm2 8l4-4-4-4 1-2 6 6-6 6z"/></g></svg>',
		title: 'Add code',
		apply: text =>
			( text.indexOf( '\n' ) > 0 ? apply( text, '```\n', '\n```\n' ) : apply( text, '`', '`' ) ),
	},
};

const Preview = props => {
	const compiled = marked( props.children );
	return <div className="Editor-preview" dangerouslySetInnerHTML={{ __html: compiled }} />;
};
Preview.propTypes = { children: PropTypes.string.isRequired };

class Editor extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			content:   '',
			height:    null,
			mode:      'edit',
			uploading: null,
		};
		this.textarea = null;
	}

	componentDidUpdate() {
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

	updateTextarea( ref ) {
		if ( ref === this.textarea ) {
			return;
		}

		this.textarea = ref;
		window.jQuery( ref ).atwho( {
			at:   '@',
			data: Object.values( this.props.users ).map( user => user.slug ),
		} );
		window.jQuery( ref ).atwho( {
			at:         ':',
			data:       Object.values( emojiIndex.emojis ),
			displayTpl: item => `<li>${item.native} ${item.colons} </li>`,
			insertTpl:  item => item.native,
		} );
	}

	onSubmit( e ) {
		e.preventDefault();

		this.props.onSubmit( marked( this.state.content ) );
	}

	onBlur() {
		const { selectionStart, selectionEnd } = this.textarea;

		const lastSelection = [ selectionStart, selectionEnd ];

		this.setState( { lastSelection } );
	}

	onFocus() {
		this.setState( { lastSelection: null } );
	}

	onButton( e, apply ) {
		e && e.preventDefault();

		let { selectionStart, selectionEnd } = this.textarea;
		if ( this.state.lastSelection ) {
			[ selectionStart, selectionEnd ] = this.state.lastSelection;
		}
		const content = this.state.content;

		const nextParts = [
			content.substring( 0, selectionStart ),
			apply( content.substring( selectionStart, selectionEnd ) ),
			content.substring( selectionEnd ),
		];

		this.setState( { content: nextParts.join( '' ) } );
	}

	onUpload( file ) {
		// Insert placeholder into the text
		const placeholder = `<img alt="Uploading ${ file.name }…" />`;
		this.onButton( null, () => `\n${ placeholder }\n` );

		this.props.onUpload( file ).then( data => {
			this.setState( state => {
				const content = state.content.replace(
					placeholder,
					`\n<img alt="${ data.title.raw }" src="${ data.source_url }" />\n`
				);

				return {
					content,
					uploading: null,
				};
			} );
		} );

		this.setState( { uploading: file } );
	}

	focus() {
		if ( ! this.textarea ) {
			return;
		}

		this.textarea.focus();
	}

	render() {
		const { content, height, mode } = this.state;

		return <form
			className={ mode === 'preview' ? 'Editor previewing' : 'Editor' }
			onSubmit={ e => this.onSubmit( e ) }
		>
			<div className="Editor-header">
				<ul className="Editor-tabs">
					<li>
						<label>
							<input
								checked={ mode === 'edit' }
								name="Editor-mode"
								type="radio"
								value="edit"
								onChange={ e => this.setState( { mode: e.target.value } ) }
							/>
							<span>Write</span>
						</label>
					</li>
					<li>
						<label>
							<input
								checked={ mode === 'preview' }
								name="Editor-mode"
								type="radio"
								value="preview"
								onChange={ e => this.setState( { mode: e.target.value } ) }
							/>
							<span>Preview</span>
						</label>
					</li>
				</ul>

				{ mode === 'edit' ?
					<ul className="Editor-toolbar">
						{ Object.keys( BUTTONS ).map( type => {
							if ( BUTTONS[ type ].separator ) {
								return <span key={ type } className="separator" />;
							}

							return <button
								key={type}
								onClick={e => this.onButton( e, BUTTONS[type].apply )}
								title={BUTTONS[type].title}
								type="button"
							>
								<span class="svg-icon" dangerouslySetInnerHTML={ { __html: BUTTONS[ type ].icon } }></span>
								<span class="screen-reader-text">{type}</span>
							</button>;
						} ) }
					</ul>
				: null }
			</div>

			<DropUpload file={ this.state.uploading } onUpload={ file => this.onUpload( file ) }>
				{ mode === 'preview' ? (
					<Preview>{ content || '*Nothing to preview*' }</Preview>
				) : (
					<textarea
						ref={ el => this.updateTextarea( el ) }
						className="Editor-editor"
						placeholder="Write a comment..."
						style={{ height }}
						value={ content }
						onBlur={ () => this.onBlur() }
						onChange={ e => this.setState( { content: e.target.value } ) }
					/>
				) }
			</DropUpload>

			<p className="Editor-submit">
				<small>
					<a
						href="http://commonmark.org/help/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Format with Markdown
					</a>
				</small>
				<span className="Editor-submit-buttons">
					{this.props.onCancel
						? <Button onClick={this.props.onCancel}>Cancel</Button>
						: null}
					<Button submit type="primary">{this.props.submitText}</Button>
				</span>
			</p>
		</form>;
	}
}

Editor.defaultProps = { submitText: 'Comment' };

Editor.propTypes = {
	submitText: PropTypes.string,
	onCancel:   PropTypes.func,
	onSubmit:   PropTypes.func.isRequired,
};

export default connect( state => ( { users: state.users.byId } ), null, null, { withRef: true } )(
	Editor
);
