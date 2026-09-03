import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
	BlockCanvas,
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockInspector,
	BlockList,
	BlockToolbar,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	SlotFillProvider,
} from '@wordpress/components';
import { useStateWithHistory } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { check, drawerRight, moreVertical } from '@wordpress/icons';

import {
	CANVAS_STYLES,
	DEFAULT_SETTINGS,
	DocumentTools,
	EMPTY_ARRAY,
	EMPTY_OBJECT,
	HistoryShortcuts,
	createMediaUpload,
	fetchLinkSuggestions,
	setMentionUsers,
	withEditorData,
} from './BlockEditorCore';

const PREFERENCE_PREFIX = 'h2-block-editor:';

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
		users,
	} = props;

	const { hasRedo, hasUndo, redo, setValue, undo, value } = useStateWithHistory( { blocks: initialBlocks } );
	const [ isSidebarOpen, setSidebarOpen ] = useState( true );

	// Toolbar mode: floating over the block (wp-admin's default) or in the header.
	const [ hasFixedToolbar, setFixedToolbar ] = useStoredPreference( 'fixed-toolbar', false );

	useEffect( () => {
		setMentionUsers( users );
	}, [ users ] );

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
	/** Users offered for @-mentions. */
	users: PropTypes.array,
};

export default withEditorData( BlockEditor );
