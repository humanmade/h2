import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import apiFetch from '@wordpress/api-fetch';
import {
	BlockCanvas,
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockInspector,
	BlockList,
	BlockToolbar,
	Inserter,
	NavigableToolbar,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import blockEditorContentStyles from '@wordpress/block-editor/build-style/content.css?raw';
import { registerCoreBlocks } from '@wordpress/block-library';
import blockLibraryEditorStyles from '@wordpress/block-library/build-style/editor.css?raw';
import blockLibraryStyles from '@wordpress/block-library/build-style/style.css?raw';
import { getBlockType, setFreeformContentHandlerName, unregisterBlockType } from '@wordpress/blocks';
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	SlotFillProvider,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import componentsStyles from '@wordpress/components/build-style/style.css?raw';
import { useKeyboardShortcut, useStateWithHistory } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import {
	check,
	drawerRight,
	moreVertical,
	plus,
	redo as redoIcon,
	undo as undoIcon,
} from '@wordpress/icons';

import api from '../../api';
import h2EditorStyle from '../../editor-style.scss?inline';
import { media } from '../../types';
import { decodeEntities } from '../../util';

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
const CANVAS_STYLES = [
	{ css: componentsStyles },
	{ css: blockEditorContentStyles },
	{ css: blockLibraryStyles },
	{ css: blockLibraryEditorStyles },
	{ css: h2EditorStyle },
	{ css: canvasStyles },
];

const DEFAULT_SETTINGS = {
	bodyPlaceholder: 'Start writing…',

	// H2 has no theme.json, so don't offer layout controls we can't render.
	supportsLayout: false,

	__experimentalFeatures: {
		typography: {
			dropCap: false,
		},
	},
};

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const UNDO_KEYS = [ 'mod+z' ];
const REDO_KEYS = [ 'mod+shift+z', 'ctrl+y' ];
const PREFERENCE_PREFIX = 'h2-block-editor:';

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
const createMediaUpload = upload => ( { allowedTypes, filesList, onError = () => {}, onFileChange } ) => {
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
const fetchLinkSuggestions = ( search, { perPage = 20 } = {} ) => {
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

/**
 * A boolean editor preference remembered in the browser, like wp-admin's
 * per-user editor preferences.
 *
 * @param {string} name Preference name.
 * @param {boolean} defaultValue Value when nothing is stored.
 * @returns {Array} Current value and a setter, like `useState`.
 */
function useStoredPreference( name, defaultValue ) {
	const key = PREFERENCE_PREFIX + name;
	const [ value, setValue ] = useState( () => {
		try {
			const stored = window.localStorage.getItem( key );
			return stored === null ? defaultValue : JSON.parse( stored );
		} catch ( e ) {
			return defaultValue;
		}
	} );

	const update = useCallback( next => {
		setValue( next );
		try {
			window.localStorage.setItem( key, JSON.stringify( next ) );
		} catch ( e ) {
			// Storage is unavailable; the choice just won't persist.
		}
	}, [ key ] );

	return [ value, update ];
}

function HistoryShortcuts( { canRedo, canUndo, onRedo, onUndo } ) {
	useKeyboardShortcut( UNDO_KEYS, event => {
		event.preventDefault();
		if ( canUndo ) {
			onUndo();
		}
	}, { bindGlobal: true } );
	useKeyboardShortcut( REDO_KEYS, event => {
		event.preventDefault();
		if ( canRedo ) {
			onRedo();
		}
	}, { bindGlobal: true } );

	return null;
}

function DocumentTools( { canRedo, canUndo, onRedo, onUndo } ) {
	return (
		<NavigableToolbar
			className="BlockEditor-document-tools"
			aria-label="Document tools"
			variant="unstyled"
		>
			<ToolbarGroup>
				<Inserter
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

/**
 * The "Options" menu, mirroring wp-admin's editor options.
 *
 * Only the toolbar mode is offered for now; distraction free, spotlight and
 * fullscreen modes can slot in alongside it later.
 *
 * @param {object} props Component props.
 * @param {boolean} props.hasFixedToolbar Whether the block toolbar is in the header.
 * @param {Function} props.onToggleFixedToolbar Toggles the toolbar mode.
 * @returns {React.ReactElement} Menu.
 */
function OptionsMenu( { hasFixedToolbar, onToggleFixedToolbar } ) {
	return (
		<DropdownMenu
			icon={ moreVertical }
			label="Options"
			popoverProps={ { placement: 'bottom-end' } }
			toggleProps={ { size: 'compact' } }
		>
			{ () => (
				<MenuGroup label="View">
					<MenuItem
						icon={ hasFixedToolbar ? check : undefined }
						info="Access all block and document tools in a single place."
						isSelected={ hasFixedToolbar }
						role="menuitemcheckbox"
						onClick={ onToggleFixedToolbar }
					>
						Top toolbar
					</MenuItem>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
}

function Sidebar( { panels } ) {
	const defaultTab = panels.length ? panels[0].name : 'block';
	const [ activeTab, setActiveTab ] = useState( defaultTab );
	const hasSelectedBlock = useSelect(
		select => !! select( blockEditorStore ).getSelectedBlockClientId(),
		[]
	);

	// Like Gutenberg, show block settings while a block is selected, and the
	// document settings otherwise.
	useEffect( () => {
		setActiveTab( hasSelectedBlock ? 'block' : defaultTab );
	}, [ defaultTab, hasSelectedBlock ] );

	const tabs = [
		...panels,
		{
			name: 'block',
			title: 'Block',
			content: <BlockInspector />,
		},
	];
	const current = tabs.find( tab => tab.name === activeTab ) || tabs[0];

	return (
		<aside
			className="BlockEditor-sidebar w-[280px] shrink-0 flex flex-col min-h-0 border-l border-hm-border-color bg-white text-[13px]"
			aria-label="Editor settings"
		>
			<div
				className="flex shrink-0 border-b border-hm-border-color"
				role="tablist"
			>
				{ tabs.map( tab => (
					<button
						key={ tab.name }
						aria-selected={ tab.name === current.name }
						className={ [
							'flex-1 h-12 bg-transparent border-0 cursor-pointer font-medium',
							tab.name === current.name
								? 'text-hm-vibrant-blue shadow-[inset_0_-2px_0_0_currentColor]'
								: 'text-[#1e1e1e] hover:text-hm-vibrant-blue',
						].join( ' ' ) }
						role="tab"
						type="button"
						onClick={ () => setActiveTab( tab.name ) }
					>
						{ tab.title }
					</button>
				) ) }
			</div>
			<div
				className="flex-1 min-h-0 overflow-y-auto"
				role="tabpanel"
			>
				{ current.content }
			</div>
		</aside>
	);
}

/**
 * A full-height Gutenberg editor: header toolbar, canvas, and settings sidebar.
 *
 * This is deliberately content-agnostic; post-specific behaviour (title,
 * saving, document settings) is layered on by the owner via props.
 *
 * @param {object} props Component props.
 * @returns {React.ReactElement} Editor.
 */
export function BlockEditor( props ) {
	const {
		actions,
		canvasHeader,
		children,
		initialBlocks = EMPTY_ARRAY,
		onChange,
		onUpload,
		panels = EMPTY_ARRAY,
		settings = EMPTY_OBJECT,
	} = props;

	const { hasRedo, hasUndo, redo, setValue, undo, value } = useStateWithHistory( { blocks: initialBlocks } );
	const [ isSidebarOpen, setSidebarOpen ] = useState( true );

	// Toolbar mode: floating over the block (wp-admin's default) or in the header.
	const [ hasFixedToolbar, setFixedToolbar ] = useStoredPreference( 'fixed-toolbar', false );

	// Keep the owner up to date, including after undo/redo.
	useEffect( () => {
		onChange( value.blocks );
	}, [ onChange, value.blocks ] );

	const editorSettings = useMemo( () => ( {
		...DEFAULT_SETTINGS,
		...settings,
		hasFixedToolbar,
		mediaUpload: createMediaUpload( onUpload ),
		__experimentalFetchLinkSuggestions: fetchLinkSuggestions,
	} ), [ hasFixedToolbar, onUpload, settings ] );

	const onInput = useCallback( ( blocks, { selection } ) => {
		setValue( {
			blocks,
			selection,
		}, true );
	}, [ setValue ] );
	const onPersist = useCallback( ( blocks, { selection } ) => {
		setValue( {
			blocks,
			selection,
		}, false );
	}, [ setValue ] );

	return (
		<SlotFillProvider>
			<BlockEditorProvider
				selection={ value.selection }
				settings={ editorSettings }
				value={ value.blocks }
				onChange={ onPersist }
				onInput={ onInput }
			>
				<BlockEditorKeyboardShortcuts.Register />
				<HistoryShortcuts
					canRedo={ hasRedo }
					canUndo={ hasUndo }
					onRedo={ redo }
					onUndo={ undo }
				/>

				<div className="BlockEditor flex flex-col h-full min-h-0 bg-white">
					<div className="BlockEditor-toolbar flex items-stretch shrink-0 h-[60px] border-b border-hm-border-color">
						<DocumentTools
							canRedo={ hasRedo }
							canUndo={ hasUndo }
							onRedo={ redo }
							onUndo={ undo }
						/>
						{ hasFixedToolbar && (
							<BlockToolbar hideDragHandle />
						) }
						<div className="flex items-center gap-2 pl-3 pr-2 ml-auto shrink-0">
							{ actions }
							<Button
								icon={ drawerRight }
								isPressed={ isSidebarOpen }
								label="Settings"
								size="compact"
								onClick={ () => setSidebarOpen( ! isSidebarOpen ) }
							/>
							<OptionsMenu
								hasFixedToolbar={ hasFixedToolbar }
								onToggleFixedToolbar={ () => setFixedToolbar( ! hasFixedToolbar ) }
							/>
						</div>
					</div>

					<div className="flex flex-1 min-h-0">
						<div className="flex flex-col flex-1 min-w-0 min-h-0">
							{ children }

							<div className="BlockEditor-canvas flex-1 min-h-0 relative">
								<BlockCanvas
									height="100%"
									styles={ CANVAS_STYLES }
								>
									<div className="h2-block-editor-canvas h2-legacy-prose">
										{ canvasHeader }
										<BlockList />
									</div>
								</BlockCanvas>
							</div>
						</div>

						{ isSidebarOpen && (
							<Sidebar panels={ panels } />
						) }
					</div>
				</div>
			</BlockEditorProvider>
		</SlotFillProvider>
	);
}

BlockEditor.propTypes = {
	/** Buttons for the right of the header (save, publish, etc). */
	actions: PropTypes.node,
	/** Rendered inside the canvas above the blocks (e.g. the title). */
	canvasHeader: PropTypes.node,
	/** Rendered between the header and the canvas (e.g. notices). */
	children: PropTypes.node,
	initialBlocks: PropTypes.array,
	/** Called with the current blocks whenever they change. */
	onChange: PropTypes.func.isRequired,
	onUpload: PropTypes.func.isRequired,
	/** Extra sidebar tabs, shown before the Block tab. */
	panels: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		content: PropTypes.node,
	} ) ),
	/** Overrides for the block editor settings. */
	settings: PropTypes.object,
};

const mapDispatchToProps = dispatch => ( {
	onUpload: file => dispatch( ( _, getState ) => (
		dispatch( media.uploadSingle( file ) )
			.then( id => ( id ? media.getSingle( getState().media, id ) : null ) )
	) ),
} );

export default connect( null, mapDispatchToProps )( BlockEditor );
