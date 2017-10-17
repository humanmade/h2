import { emojiIndex } from 'emoji-mart';
import marked from 'marked';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Button from './Button';

import './Editor.css';

const apply = ( selection, start, end ) => {
	return selection.length ? start + selection + end : start;
};

const BUTTONS = {
	bold: {
		icon: 'editor-bold',
		title: 'Add bold text',
		apply: text => apply( text, "**", "**" ),
	},
	italic: {
		icon: 'editor-italic',
		title: 'Add italic text',
		apply: text => apply( text, "*", "*" ),
	},
	sep1: { separator: true },
	quote: {
		icon: 'editor-quote',
		title: 'Add blockquote',
		apply: text => apply( text, '>', '\n' ),
	},
	code: {
		icon: 'editor-code',
		title: 'Add code',
		apply: text => text.indexOf( '\n' ) > 0 ? apply( text, '```\n', '\n```\n' ) : apply( text, '`', '`' ),
	},
};

const Preview = props => {
	const compiled = marked( props.children );
	return <div className="Editor-preview" dangerouslySetInnerHTML={{ __html: compiled }} />;
};
Preview.propTypes = {
	children: PropTypes.string.isRequired,
};

class Editor extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			content: '',
			height: null,
			mode: 'edit',
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
			this.setState({ height: desired });
		}
	}

	updateTextarea( ref ) {
		if ( ref === this.textarea ) {
			return;
		}

		this.textarea = ref;
		window.jQuery( ref ).atwho({
			at: "@",
			data: Object.values( this.props.users ).map( user => user.slug ),
		});
		window.jQuery( ref ).atwho({
			at: ":",
			data: Object.values( emojiIndex.emojis ),
			displayTpl: item => `<li>${ item.native } ${ item.colons } </li>`,
			insertTpl: item => item.native,
		});
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
			content.substring( selectionEnd )
		];

		this.setState({ content: nextParts.join( '' ) });
	}

	focus() {
		if ( ! this.textarea ) {
			return;
		}

		this.textarea.focus();
	}

	render() {
		const { content, height, mode } = this.state;

		return <form onSubmit={ e => this.onSubmit( e ) }>
			<div className="Editor-header">
				<ul className="Editor-tabs">
					<li>
						<label>
							<input
								checked={ mode === 'edit' }
								name="Editor-mode"
								type="radio"
								value="edit"
								onChange={ e => this.setState({ mode: e.target.value }) }
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
								onChange={ e => this.setState({ mode: e.target.value }) }
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
								key={ type }
								onClick={ e => this.onButton( e, BUTTONS[ type ].apply ) }
								title={ BUTTONS[ type ].title }
								type="button"
							>
								{/*<span className={`dashicons dashicons-${ BUTTONS[ type ].icon }`} />*/}
								{ type }
							</button>;
						} ) }
					</ul>
				: null }
			</div>

			{ mode === 'preview' ? (
				<Preview>{ content || "*Nothing to preview*" }</Preview>
			) : (
				<textarea
					ref={ el => this.updateTextarea( el ) }
					className="Editor-editor"
					placeholder="Write a comment..."
					style={{ height }}
					value={ content }
					onChange={ e => this.setState({ content: e.target.value }) }
				/>
			) }

			<p className="Editor-submit">
				<small>
					<a
						href="http://commonmark.org/help/"
						rel="noopener noreferrer"
						target="_blank"
					>Format with Markdown</a>
				</small>
				<span className="Editor-submit-buttons">
					{ this.props.onCancel ?
						<Button onClick={ this.props.onCancel }>Cancel</Button>
					: null }
					<Button submit>{ this.props.submitText }</Button>
				</span>
			</p>
		</form>;
	}
}

Editor.defaultProps = {
	submitText: 'Comment',
};

Editor.propTypes = {
	submitText: PropTypes.string,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
};

export default connect( state => ( { users: state.users.byId } ), null, null, { withRef: true } )( Editor );
