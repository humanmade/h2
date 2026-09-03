/**
 * Shared plumbing for H2's block editors.
 *
 * Registers blocks and formats, wires Gutenberg's data needs (uploads, link
 * search, API access, @-mentions) into H2, and provides the pieces both the
 * full post editor and the inline comment editor are built from.
 */
import React from 'react';
import { connect } from 'react-redux';

import apiFetch from '@wordpress/api-fetch';
import { Inserter, NavigableToolbar } from '@wordpress/block-editor';
import blockEditorContentStyles from '@wordpress/block-editor/build-style/content.css?raw';
import { registerCoreBlocks } from '@wordpress/block-library';
import blockLibraryEditorStyles from '@wordpress/block-library/build-style/editor.css?raw';
import blockLibraryStyles from '@wordpress/block-library/build-style/style.css?raw';
import {
	getBlockType,
	parse,
	rawHandler,
	setFreeformContentHandlerName,
	unregisterBlockType,
} from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import componentsStyles from '@wordpress/components/build-style/style.css?raw';
import { useKeyboardShortcut } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { plus, redo as redoIcon, undo as undoIcon } from '@wordpress/icons';

import api from '../../api';
import compileMarkdown from '../../compile-markdown';
import h2EditorStyle from '../../editor-style.scss?inline';
import { media } from '../../types';
import { decodeEntities, isBlockContent } from '../../util';

import canvasStyles from './BlockEditor.scss?inline';

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/format-library';
import '@wordpress/format-library/build-style/style.css';
import './BlockEditor.css';

/**
 * Blocks which are never made available in H2.
 *
 * The Classic block needs TinyMCE from wp-admin, which isn't loaded here. Add
 * further blocks to this list to disable them globally.
 */
const DISABLED_BLOCKS = [
	'core/freeform',
];

/**
 * Register the core blocks (once) and apply H2's global tweaks.
 */
function registerBlocks() {
	if ( getBlockType( 'core/paragraph' ) ) {
		return;
	}

	registerCoreBlocks();

	DISABLED_BLOCKS.forEach( name => {
		if ( getBlockType( name ) ) {
			unregisterBlockType( name );
		}
	} );

	// Content which isn't wrapped in block delimiters would normally be handed
	// to the Classic block; use the Custom HTML block instead.
	setFreeformContentHandlerName( 'core/html' );
}

/**
 * Point Gutenberg's own API client at this site.
 *
 * Embeds, server-rendered blocks, and other data-driven blocks fetch through
 * `@wordpress/api-fetch` rather than H2's API client.
 */
function configureApiFetch() {
	if ( window.__h2BlockEditorApiFetch ) {
		return;
	}
	window.__h2BlockEditorApiFetch = true;

	apiFetch.use( apiFetch.createRootURLMiddleware( window.wpApiSettings.root ) );
	apiFetch.use( apiFetch.createNonceMiddleware( window.wpApiSettings.nonce ) );
}

registerBlocks();
configureApiFetch();

// Styles injected into the editor canvas (an iframe), in order.
export const CANVAS_STYLES = [
	{ css: componentsStyles },
	{ css: blockEditorContentStyles },
	{ css: blockLibraryStyles },
	{ css: blockLibraryEditorStyles },
	{ css: h2EditorStyle },
	{ css: canvasStyles },
];

export const DEFAULT_SETTINGS = {
	bodyPlaceholder: 'Start writing…',

	// H2 has no theme.json, so don't offer layout controls we can't render.
	supportsLayout: false,

	__experimentalFeatures: {
		typography: {
			dropCap: false,
		},
	},
};

export const EMPTY_ARRAY = [];
export const EMPTY_OBJECT = {};

const UNDO_KEYS = [ 'mod+z' ];
const REDO_KEYS = [ 'mod+shift+z', 'ctrl+y' ];

/**
 * Convert saved content into blocks.
 *
 * Block content is parsed directly; Markdown is compiled and converted the
 * same way Gutenberg converts classic content.
 *
 * @param {string} content Block markup or Markdown.
 * @returns {object[]} Blocks.
 */
export function contentToBlocks( content ) {
	if ( ! content ) {
		return [];
	}

	if ( isBlockContent( content ) ) {
		return parse( content );
	}

	return rawHandler( { HTML: compileMarkdown( content ) } );
}

const isAllowedType = ( allowedTypes, file ) => {
	if ( ! allowedTypes || ! allowedTypes.length ) {
		return true;
	}

	return allowedTypes.some( type => (
		type.includes( '/' ) ? type === file.type : file.type.startsWith( `${ type }/` )
	) );
};

/**
 * Convert a REST API attachment into the shape blocks expect from uploads.
 *
 * @param {object} data Attachment from the REST API.
 * @returns {object} Media object.
 */
const transformAttachment = data => ( {
	...data,
	alt: data.alt_text,
	caption: data.caption ? data.caption.raw : '',
	title: data.title ? data.title.raw : '',
	url: data.source_url,
} );

/**
 * Build the `mediaUpload` editor setting on top of H2's media uploads.
 *
 * @param {Function} upload Uploads a File, resolving with the attachment data.
 * @returns {Function} Upload handler for the block editor.
 */
export const createMediaUpload = upload => ( { allowedTypes, filesList, onError = () => {}, onFileChange } ) => {
	const files = Array.from( filesList ).filter( file => {
		if ( isAllowedType( allowedTypes, file ) ) {
			return true;
		}

		onError( {
			code: 'MIME_TYPE_NOT_ALLOWED',
			message: `${ file.name }: this file type isn't supported here.`,
			file,
		} );
		return false;
	} );

	if ( ! files.length ) {
		return;
	}

	// Show temporary previews while the uploads are in progress.
	const results = files.map( file => ( { url: URL.createObjectURL( file ) } ) );
	onFileChange( [ ...results ] );

	files.forEach( ( file, index ) => {
		upload( file )
			.then( data => {
				if ( ! data ) {
					throw new Error( `Could not upload ${ file.name }.` );
				}

				URL.revokeObjectURL( results[ index ].url );
				results[ index ] = transformAttachment( data );
				onFileChange( results.filter( Boolean ) );
			} )
			.catch( error => {
				URL.revokeObjectURL( results[ index ].url );
				results[ index ] = null;
				onError( {
					code: 'GENERAL',
					message: error.message,
					file,
				} );
				onFileChange( results.filter( Boolean ) );
			} );
	} );
};

/**
 * Search the site for content to link to, for the link UI.
 *
 * @param {string} search Search term.
 * @param {object} options Options.
 * @param {number} options.perPage Number of results.
 * @returns {Promise<object[]>} Link suggestions.
 */
export const fetchLinkSuggestions = ( search, { perPage = 20 } = {} ) => {
	return api.get( '/wp/v2/search', {
		search,
		per_page: perPage,
		_fields: 'id,title,type,subtype,url',
	} ).then( results => results.map( result => ( {
		id: result.id,
		kind: 'post-type',
		title: decodeEntities( result.title ) || '(no title)',
		type: result.subtype || result.type,
		url: result.url,
	} ) ) );
};

/*
 * @-mentions.
 *
 * Mentions are plain `@slug` text which H2 links up when rendering, so the
 * completer only needs to insert that. Users come from H2's store; the editor
 * components keep the list current via setMentionUsers().
 */
let mentionUsers = [];

/**
 * Provide the users offered for @-mentions.
 *
 * @param {object[]} users Users from the REST API.
 */
export function setMentionUsers( users ) {
	mentionUsers = users || [];
}

const mentionCompleter = {
	name: 'h2/mentions',
	className: 'BlockEditor-mention',
	triggerPrefix: '@',
	options: () => mentionUsers,
	getOptionKeywords: user => [ user.slug, user.name ],
	getOptionLabel: user => (
		<span className="flex items-center gap-2 max-w-[400px]">
			<img
				alt=""
				className="w-6 h-6 max-w-none rounded-full"
				src={ user.avatar_urls ? user.avatar_urls[48] : '' }
			/>
			<span className="grow overflow-hidden text-ellipsis whitespace-nowrap">{ user.name }</span>
			<span className="text-xs opacity-60">@{ user.slug }</span>
		</span>
	),
	getOptionCompletion: user => `@${ user.slug } `,
};

addFilter( 'editor.Autocomplete.completers', 'h2/mentions', completers => [
	...completers,
	mentionCompleter,
] );

/**
 * Keyboard undo/redo, which the standalone block editor doesn't provide.
 *
 * @param {object} props Component props.
 * @param {boolean} props.canRedo Whether redo is available.
 * @param {boolean} props.canUndo Whether undo is available.
 * @param {Function} props.onRedo Redo handler.
 * @param {Function} props.onUndo Undo handler.
 * @param {object} [props.target] Ref to scope the shortcuts to; defaults to the document.
 * @returns {null} Nothing.
 */
export function HistoryShortcuts( { canRedo, canUndo, onRedo, onUndo, target } ) {
	useKeyboardShortcut( UNDO_KEYS, event => {
		event.preventDefault();
		if ( canUndo ) {
			onUndo();
		}
	}, {
		bindGlobal: true,
		target,
	} );
	useKeyboardShortcut( REDO_KEYS, event => {
		event.preventDefault();
		if ( canRedo ) {
			onRedo();
		}
	}, {
		bindGlobal: true,
		target,
	} );

	return null;
}

/**
 * Inserter, undo and redo.
 *
 * @param {object} props Component props.
 * @param {boolean} props.canRedo Whether redo is available.
 * @param {boolean} props.canUndo Whether undo is available.
 * @param {Function} props.onRedo Redo handler.
 * @param {Function} props.onUndo Undo handler.
 * @param {boolean} [props.isQuickInserter] Use the compact inserter (search and a short list) instead of the full library.
 * @returns {React.ReactElement} Toolbar.
 */
export function DocumentTools( { canRedo, canUndo, isQuickInserter = false, onRedo, onUndo } ) {
	return (
		<NavigableToolbar
			className="BlockEditor-document-tools"
			aria-label="Document tools"
			variant="unstyled"
		>
			<ToolbarGroup>
				<Inserter
					__experimentalIsQuick={ isQuickInserter }
					position="bottom right"
					renderToggle={ ( { disabled, isOpen, onToggle } ) => (
						<ToolbarButton
							disabled={ disabled }
							icon={ plus }
							isPressed={ isOpen }
							label="Add block"
							size="compact"
							variant="primary"
							onClick={ onToggle }
						/>
					) }
					showInserterHelpPanel
				/>
				<ToolbarButton
					disabled={ ! canUndo }
					icon={ undoIcon }
					label="Undo"
					size="compact"
					onClick={ onUndo }
				/>
				<ToolbarButton
					disabled={ ! canRedo }
					icon={ redoIcon }
					label="Redo"
					size="compact"
					onClick={ onRedo }
				/>
			</ToolbarGroup>
		</NavigableToolbar>
	);
}

const mapStateToProps = state => ( {
	users: state.users.posts,
} );

const mapDispatchToProps = dispatch => ( {
	onUpload: file => dispatch( ( _, getState ) => (
		dispatch( media.uploadSingle( file ) )
			.then( id => ( id ? media.getSingle( getState().media, id ) : null ) )
	) ),
} );

/**
 * Connect an editor to H2's store: users for mentions, and media uploads.
 */
export const withEditorData = connect( mapStateToProps, mapDispatchToProps );
