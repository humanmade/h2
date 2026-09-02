import countWords from '@iarna/word-count';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedRelative } from 'react-intl';
import { Prompt } from 'react-router-dom';
import Turndown from 'turndown';

import { store as blockEditorStore } from '@wordpress/block-editor';
import { parse, rawHandler, serialize } from '@wordpress/blocks';
import { Button, Panel, PanelBody, SelectControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

import compileMarkdown from '../../compile-markdown';
import { cleanConvertedMarkdown, isBlockContent } from '../../util';
import BlockEditor from '../Editor/BlockEditor';
import Notification from '../Notification';

import SelectDraft from './SelectDraft';

const NAVIGATE_WARNING = 'You have unsaved content. Are you sure you want to leave? Your content will not be saved.';
const CONVERT_WARNING = 'Switching to the Markdown editor converts your blocks to Markdown, and some formatting may be lost. Continue?';

/**
 * Convert saved post content into blocks.
 *
 * Block posts are parsed directly; Markdown is compiled and converted the
 * same way Gutenberg converts classic content.
 *
 * @param {string} content Block markup or Markdown.
 * @returns {object[]} Blocks.
 */
function contentToBlocks( content ) {
	if ( ! content ) {
		return [];
	}

	if ( isBlockContent( content ) ) {
		return parse( content );
	}

	return rawHandler( { HTML: compileMarkdown( content ) } );
}

/**
 * Convert blocks to Markdown for the Markdown editor.
 *
 * @param {object[]} blocks Blocks.
 * @returns {string} Markdown.
 */
function blocksToMarkdown( blocks ) {
	const turndown = new Turndown( {
		headingStyle: 'atx',
		hr: '---',
		codeBlockStyle: 'fenced',
	} );
	return cleanConvertedMarkdown( turndown.turndown( serialize( blocks ) ) );
}

function PostTitle( { onChange, value } ) {
	const ref = useRef( null );
	const { insertDefaultBlock } = useDispatch( blockEditorStore );

	// Grow to fit the title.
	useEffect( () => {
		const el = ref.current;
		if ( ! el ) {
			return;
		}

		el.style.height = 'auto';
		el.style.height = `${ el.scrollHeight }px`;
	}, [ value ] );

	// Start in the title for new posts.
	useEffect( () => {
		if ( ! value && ref.current ) {
			ref.current.focus();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return (
		<textarea
			ref={ ref }
			aria-label="Post title"
			className="h2-block-editor-title"
			placeholder="Enter post title..."
			rows={ 1 }
			value={ value }
			onChange={ e => onChange( e.target.value.replace( /\n/g, ' ' ) ) }
			onKeyDown={ e => {
				if ( e.key !== 'Enter' ) {
					return;
				}

				// Move on to the content, like Gutenberg does.
				e.preventDefault();
				insertDefaultBlock( undefined, undefined, 0 );
			} }
		/>
	);
}

function PreviewUrl( { url } ) {
	const [ didCopy, setDidCopy ] = useState( false );

	const onClick = e => {
		e.preventDefault();
		e.target.select();
		document.execCommand( 'copy' );

		// Show copy indicator, and hide after 1 second.
		setDidCopy( true );
		window.setTimeout( () => setDidCopy( false ), 1000 );
	};

	return (
		<p className="m-0">
			<span className="block mb-1">Preview URL:</span>
			<input
				className="w-full bg-hm-light-grey px-[5px] py-0 border-none text-inherit text-xs"
				readOnly
				type="text"
				value={ url }
				onClick={ onClick }
				onMouseOver={ e => e.target.select() }
			/>
			<span
				className={ `block transition-opacity duration-100 ${ didCopy ? 'opacity-100' : 'opacity-0' }` }
			>
				Copied!
			</span>
		</p>
	);
}

/**
 * Block editor for writing posts.
 *
 * Owns the blocks while editing; the parent owns everything else about the
 * post (title, category, draft state) and performs the saves.
 *
 * @param {object} props Component props.
 * @returns {React.ReactElement} Editor.
 */
export default function PostBlockEditor( props ) {
	const {
		categories,
		category,
		draftUrl,
		error,
		initialContent,
		isSaving,
		isSubmitting,
		lastSave,
		onCancel,
		onChangeCategory,
		onChangeTitle,
		onSave,
		onSelectDraft,
		onSubmit,
		onSwitchToMarkdown,
		title,
		user,
	} = props;

	const [ initialBlocks ] = useState( () => contentToBlocks( initialContent ) );
	const [ blocks, setBlocks ] = useState( initialBlocks );

	// Blocks as of the last save, for change tracking. Content converted from
	// Markdown counts as unsaved.
	const [ savedBlocks, setSavedBlocks ] = useState( () => (
		( ! initialContent || isBlockContent( initialContent ) ) ? initialBlocks : null
	) );
	const pendingSave = useRef( null );

	useEffect( () => {
		if ( lastSave && pendingSave.current ) {
			setSavedBlocks( pendingSave.current );
			pendingSave.current = null;
		}
	}, [ lastSave ] );

	const isDirty = blocks !== savedBlocks;

	useEffect( () => {
		if ( ! isDirty ) {
			return;
		}

		const warnBeforeLeaving = e => {
			e.returnValue = NAVIGATE_WARNING;
			return NAVIGATE_WARNING;
		};
		window.addEventListener( 'beforeunload', warnBeforeLeaving );
		return () => window.removeEventListener( 'beforeunload', warnBeforeLeaving );
	}, [ isDirty ] );

	const wordCount = useMemo( () => {
		return countWords( serialize( blocks ).replace( /<[^>]*>/g, ' ' ) );
	}, [ blocks ] );

	const save = () => {
		pendingSave.current = blocks;
		onSave( serialize( blocks ), '' );
	};

	const publish = () => {
		onSubmit( serialize( blocks ), '' );
	};

	const switchToMarkdown = () => {
		if ( blocks.length && ! window.confirm( CONVERT_WARNING ) ) {
			return;
		}

		onSwitchToMarkdown( blocksToMarkdown( blocks ) );
	};

	const actions = (
		<React.Fragment>
			{ onCancel && (
				<Button
					size="compact"
					variant="tertiary"
					onClick={ onCancel }
				>
					Cancel
				</Button>
			) }
			<Button
				disabled={ isSaving }
				isBusy={ isSaving }
				size="compact"
				variant="tertiary"
				onClick={ save }
			>
				{ isSaving ? 'Saving…' : 'Save draft' }
			</Button>
			<Button
				disabled={ isSubmitting }
				isBusy={ isSubmitting }
				size="compact"
				variant="primary"
				onClick={ publish }
			>
				{ isSubmitting ? 'Publishing…' : 'Publish' }
			</Button>
		</React.Fragment>
	);

	const categoryOptions = [
		{
			label: '- Category -',
			value: '',
		},
		...categories.map( item => ( {
			label: item.name,
			value: String( item.id ),
		} ) ),
	];

	const panels = [
		{
			name: 'post',
			title: 'Post',
			content: (
				<Panel>
					<PanelBody title="Summary">
						<p className="m-0 mb-2">
							{ user ? user.name : '' }
							{ ', ' }
							{ draftUrl ? 'draft' : 'new post' }
						</p>
						<p className="m-0 mb-2">
							{ wordCount === 1 ? '1 word' : `${ wordCount.toLocaleString() } words` }
						</p>
						{ lastSave && (
							<p className="m-0 mb-2">
								{ 'Last saved ' }
								<FormattedRelative value={ lastSave } />
							</p>
						) }
						{ draftUrl && (
							<PreviewUrl url={ draftUrl } />
						) }
					</PanelBody>
					{ categories.length > 0 && (
						<PanelBody title="Category">
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label="Category"
								hideLabelFromVision
								options={ categoryOptions }
								value={ category ? String( category ) : '' }
								onChange={ value => onChangeCategory( value || null ) }
							/>
						</PanelBody>
					) }
					<PanelBody title="Drafts">
						<SelectDraft
							renderToggle={ ( { count, onClick } ) => (
								<Button
									size="compact"
									variant="secondary"
									onClick={ onClick }
								>
									{ count === null ? 'Drafts' : `Drafts (${ count })` }
								</Button>
							) }
							user={ user || null }
							onSelect={ onSelectDraft }
						/>
					</PanelBody>
					<PanelBody title="Editor">
						<p className="mt-0">
							Prefer plain text? Your post will be converted to Markdown.
						</p>
						<Button
							size="compact"
							variant="secondary"
							onClick={ switchToMarkdown }
						>
							Switch to Markdown
						</Button>
					</PanelBody>
				</Panel>
			),
		},
	];

	return (
		<BlockEditor
			actions={ actions }
			canvasHeader={ (
				<PostTitle
					value={ title }
					onChange={ onChangeTitle }
				/>
			) }
			initialBlocks={ initialBlocks }
			panels={ panels }
			onChange={ setBlocks }
		>
			{ /* Publishing navigates to the post; don't prompt for that. */ }
			<Prompt
				message={ NAVIGATE_WARNING }
				when={ isDirty && ! isSubmitting }
			/>
			{ error && (
				<div className="px-5 pt-5 shrink-0">
					<Notification type="error">
						Could not submit: { error.message }
					</Notification>
				</div>
			) }
		</BlockEditor>
	);
}

PostBlockEditor.propTypes = {
	categories: PropTypes.array.isRequired,
	category: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	draftUrl: PropTypes.string,
	error: PropTypes.object,
	/** Block markup or Markdown to start from. */
	initialContent: PropTypes.string,
	isSaving: PropTypes.bool,
	isSubmitting: PropTypes.bool,
	lastSave: PropTypes.number,
	title: PropTypes.string.isRequired,
	user: PropTypes.object,
	onCancel: PropTypes.func,
	onChangeCategory: PropTypes.func.isRequired,
	onChangeTitle: PropTypes.func.isRequired,
	/** Called with ( content, unprocessedContent ). */
	onSave: PropTypes.func.isRequired,
	onSelectDraft: PropTypes.func.isRequired,
	/** Called with ( content, unprocessedContent ). */
	onSubmit: PropTypes.func.isRequired,
	/** Called with the post converted to Markdown. */
	onSwitchToMarkdown: PropTypes.func.isRequired,
};
