import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	BlockCanvas,
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
} from '@wordpress/block-editor';
import { serialize } from '@wordpress/blocks';
import { SlotFillProvider } from '@wordpress/components';
import { useStateWithHistory } from '@wordpress/compose';

import {
	CANVAS_STYLES,
	DEFAULT_SETTINGS,
	DocumentTools,
	HistoryShortcuts,
	contentToBlocks,
	createMediaUpload,
	fetchLinkSuggestions,
	setMentionUsers,
	withEditorData,
} from './BlockEditorCore';

// Grow with the content, like the Markdown textarea (min-h-72 / max-h-120).
const MIN_HEIGHT = 288;
const MAX_HEIGHT = 480;

/**
 * Size the canvas to its content.
 *
 * The canvas is an iframe, so watch the content wrapper inside it once the
 * iframe has rendered and mirror its height onto the container.
 *
 * @param {object} containerRef Ref to the element wrapping the canvas.
 * @returns {number} Height in pixels.
 */
function useAutoHeight( containerRef ) {
	const [ height, setHeight ] = useState( MIN_HEIGHT );

	useEffect( () => {
		const container = containerRef.current;
		if ( ! container ) {
			return;
		}

		let observer = null;
		let attempts = 0;
		const timer = window.setInterval( () => {
			const iframe = container.querySelector( 'iframe[name="editor-canvas"]' );
			const doc = iframe && iframe.contentDocument;
			const content = doc && doc.querySelector( '.h2-block-editor-canvas' );
			attempts++;

			if ( ! content ) {
				if ( attempts > 100 ) {
					window.clearInterval( timer );
				}
				return;
			}

			window.clearInterval( timer );
			const Observer = doc.defaultView.ResizeObserver;
			observer = new Observer( () => {
				setHeight( Math.min( MAX_HEIGHT, Math.max( MIN_HEIGHT, content.offsetHeight ) ) );
			} );
			observer.observe( content );
		}, 100 );

		return () => {
			window.clearInterval( timer );
			if ( observer ) {
				observer.disconnect();
			}
		};
	}, [ containerRef ] );

	return height;
}

/**
 * A compact block editor for comments and similar short content.
 *
 * No sidebar, no title, a floating block toolbar, and only the blocks the
 * owner allows. Reports the serialized blocks on every change.
 *
 * @param {object} props Component props.
 * @returns {React.ReactElement} Editor.
 */
export function InlineBlockEditor( props ) {
	const {
		allowedBlocks,
		initialContent,
		onChange,
		onUpload,
		placeholder = 'Write a comment…',
		users,
	} = props;

	const rootRef = useRef( null );
	const [ initialBlocks ] = useState( () => contentToBlocks( initialContent ) );
	const { hasRedo, hasUndo, redo, setValue, undo, value } = useStateWithHistory( { blocks: initialBlocks } );
	const height = useAutoHeight( rootRef );

	useEffect( () => {
		setMentionUsers( users );
	}, [ users ] );

	// Keep the owner up to date, including after undo/redo.
	useEffect( () => {
		onChange( serialize( value.blocks ), value.blocks );
	}, [ onChange, value.blocks ] );

	const settings = useMemo( () => ( {
		...DEFAULT_SETTINGS,
		allowedBlockTypes: allowedBlocks || true,
		bodyPlaceholder: placeholder,
		hasFixedToolbar: false,
		mediaUpload: createMediaUpload( onUpload ),
		__experimentalFetchLinkSuggestions: fetchLinkSuggestions,
	} ), [ allowedBlocks, onUpload, placeholder ] );

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
				settings={ settings }
				value={ value.blocks }
				onChange={ onPersist }
				onInput={ onInput }
			>
				<BlockEditorKeyboardShortcuts.Register />
				<HistoryShortcuts
					canRedo={ hasRedo }
					canUndo={ hasUndo }
					target={ rootRef }
					onRedo={ redo }
					onUndo={ undo }
				/>

				<div
					ref={ rootRef }
					className="BlockEditor BlockEditor--inline flex flex-col mb-4 border-2 border-hm-border-color rounded-tr bg-white text-base"
				>
					<div className="BlockEditor-toolbar flex items-stretch shrink-0 h-12 border-b border-hm-border-color">
						<DocumentTools
							canRedo={ hasRedo }
							canUndo={ hasUndo }
							isQuickInserter
							onRedo={ redo }
							onUndo={ undo }
						/>
					</div>
					<div
						className="BlockEditor-canvas relative"
						style={ { height } }
					>
						<BlockCanvas
							height="100%"
							styles={ CANVAS_STYLES }
						>
							<div className="h2-block-editor-canvas h2-block-editor-canvas--inline h2-legacy-prose">
								<BlockList />
							</div>
						</BlockCanvas>
					</div>
				</div>
			</BlockEditorProvider>
		</SlotFillProvider>
	);
}

InlineBlockEditor.propTypes = {
	/** Block names to allow; everything else is hidden from the inserter. */
	allowedBlocks: PropTypes.arrayOf( PropTypes.string ),
	/** Block markup or Markdown to start from. */
	initialContent: PropTypes.string,
	/** Called with ( serializedHtml, blocks ) whenever the blocks change. */
	onChange: PropTypes.func.isRequired,
	onUpload: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	/** Users offered for @-mentions. */
	users: PropTypes.array,
};

export default withEditorData( InlineBlockEditor );
