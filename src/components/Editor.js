import marked from 'marked';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import getCaretCoordinates from 'textarea-caret';

import Button from './Button';
import EmojiCompletion from './EmojiCompletion';
import MentionCompletion from './MentionCompletion';

import './Editor.css';

const apply = ( selection, start, end ) => {
	return selection.length ? start + selection + end : start;
};

const BUTTONS = {
	bold: {
		icon:  'editor-bold',
		title: 'Add bold text',
		apply: text => apply( text, '**', '**' ),
	},
	italic: {
		icon:  'editor-italic',
		title: 'Add italic text',
		apply: text => apply( text, '*', '*' ),
	},
	sep1:  { separator: true },
	quote: {
		icon:  'editor-quote',
		title: 'Add blockquote',
		apply: text => apply( text, '>', '\n' ),
	},
	code: {
		icon:  'editor-code',
		title: 'Add code',
		apply: text =>
			( text.indexOf( '\n' ) > 0 ? apply( text, '```\n', '\n```\n' ) : apply( text, '`', '`' ) ),
	},
};

const completions = {
	'@': () => {},
	':': () => {},
};

const Preview = props => {
	const compiled = marked( props.children );
	return <div className="Editor-preview" dangerouslySetInnerHTML={{ __html: compiled }} />;
};
Preview.propTypes = { children: PropTypes.string.isRequired };

export default class Editor extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			completion: null,
			content: '',
			height:  null,
			mode:    'edit',
		};
		this.textarea = null;

		this.completions = {
			'@': completion => <MentionCompletion
				{ ...completion }
				items={ Object.values( this.props.users ) }
			/>,
			':': completion => <EmojiCompletion { ...completion } />,
		};
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
	}

	onKeyDown( e ) {
		const { key, target } = e;
		if ( ! this.completions[ key ] ) {
			return;
		}

		const coords = getCaretCoordinates( target, target.selectionEnd );
		const completion = {
			key,
			coords,
			start: target.selectionEnd,
		};
		this.setState( { completion } );
	}

	onInput( e ) {
		const { completion } = this.state;
		if ( ! completion ) {
			return;
		}

		const { target } = e;
		const nextCompletion = {
			...completion,
			end: target.selectionEnd + 1,
		};
		this.setState( {
			completion: nextCompletion,
		} );
	}

	onSubmit( e ) {
		e.preventDefault();

		this.props.onSubmit( marked( this.state.content ) );
	}

	onButton( e, apply ) {
		e.preventDefault();

		const { selectionStart, selectionEnd } = this.textarea;
		const content = this.state.content;

		const nextParts = [
			content.substring( 0, selectionStart ),
			apply( content.substring( selectionStart, selectionEnd ) ),
			content.substring( selectionEnd ),
		];

		this.setState( { content: nextParts.join( '' ) } );
	}

	getCompletion() {
		const { completion, content } = this.state;

		if ( ! completion ) {
			return null;
		}

		const completionProps = {
			key:     completion.key,
			coords:  completion.coords,
			text:    content.substring( completion.start + 1, completion.end + 1 ),
			trigger: completion.key,
			onSelect: val => {
				const content = this.state.content;

				const nextParts = [
					content.substring( 0, completion.start ),
					val,
					content.substring( completion.end ),
				];

				this.setState( {
					completion: null,
					content: nextParts.join( '' ),
				} );
			},
		};

		const handler = this.completions[ completion.key ];
		if ( ! handler ) {
			return null;
		}
		return handler( completionProps );
	}

	focus() {
		if ( ! this.textarea ) {
			return;
		}

		this.textarea.focus();
	}

	render() {
		const { completion, content, height, mode } = this.state;

		return (
			<form onSubmit={e => this.onSubmit( e )}>
				<div className="Editor-header">
					<ul className="Editor-tabs">
						<li>
							<label>
								<input
									checked={mode === 'edit'}
									name="Editor-mode"
									type="radio"
									value="edit"
									onChange={e => this.setState( { mode: e.target.value } )}
								/>
								<span>Write</span>
							</label>
						</li>
						<li>
							<label>
								<input
									checked={mode === 'preview'}
									name="Editor-mode"
									type="radio"
									value="preview"
									onChange={e => this.setState( { mode: e.target.value } )}
								/>
								<span>Preview</span>
							</label>
						</li>
					</ul>
					{mode === 'edit'
						? <ul className="Editor-toolbar">
								{Object.keys( BUTTONS ).map( type => {
									if ( BUTTONS[type].separator ) {
										return <span key={type} className="separator" />;
									}

									return (
										<button
											key={type}
											onClick={e => this.onButton( e, BUTTONS[type].apply )}
											title={BUTTONS[type].title}
											type="button"
										>
											{/*<span className={`dashicons dashicons-${ BUTTONS[ type ].icon }`} />*/}
											{type}
										</button>
									);
								} )}
							</ul>
						: null}
				</div>

				<div className="Editor-editor-container">

					{ mode === 'preview' ?
						<Preview>{ content || '*Nothing to preview*' }</Preview>
					:
						<textarea
							ref={el => this.updateTextarea( el )}
							className="Editor-editor"
							placeholder="Write a comment..."
							style={{ height }}
							value={content}
							onChange={e => this.setState( { content: e.target.value } )}
							onInput={ e => this.onInput( e ) }
							onKeyDown={ e => this.onKeyDown( e ) }
						/>
					}

					{ mode !== 'preview' ? this.getCompletion() : null }

				</div>

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
			</form>
		);
	}
}

Editor.defaultProps = { submitText: 'Comment' };

Editor.propTypes = {
	submitText: PropTypes.string,
	onCancel:   PropTypes.func,
	onSubmit:   PropTypes.func.isRequired,
};
