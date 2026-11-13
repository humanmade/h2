import React, { useEffect, useRef, useState } from 'react';

import api from '../../api';
import { parseResponse } from '../../wordpress-rest-api-cookie-auth';
import Button from '../Button';
import PencilIcon from '../PencilIcon';

/**
 * Decode the description returned by the settings endpoint.
 *
 * WordPress stores the description HTML-escaped. This matches the decoding of
 * H2Data.site.description on page load, and is safe as a textarea's content is
 * only ever treated as text.
 *
 * @param {string} text Escaped text.
 * @returns {string} Decoded text.
 */
const decodeDescription = text => {
	const textarea = document.createElement( 'textarea' );
	textarea.innerHTML = text;
	return textarea.value;
};

export default function SiteDescription() {
	const site = window.H2Data.site;

	// The text being edited, or null when not editing.
	const [ draft, setDraft ] = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ error, setError ] = useState( null );
	const isEditing = draft !== null;

	// The textarea takes focus with it when it goes, so hand focus back.
	const editButton = useRef( null );
	const wasEditing = useRef( false );
	useEffect( () => {
		if ( wasEditing.current && ! isEditing ) {
			editButton.current.focus();
		}
		wasEditing.current = isEditing;
	}, [ isEditing ] );

	const onCancel = () => {
		setDraft( null );
		setError( null );
	};

	const onSave = () => {
		// The description is a single line, so flatten any pasted line breaks.
		const description = draft.replace( /\s+/g, ' ' ).trim();
		if ( description === site.description ) {
			onCancel();
			return;
		}

		setIsSaving( true );
		setError( null );
		api.fetch( '/wp/v2/settings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( { description } ),
		} )
			.then( parseResponse )
			.then( data => {
				// Update the shared data rather than local state, as the sidebar
				// remounts when switching views, and the site switcher uses it too.
				site.description = decodeDescription( data.description );
				setDraft( null );
			} )
			.catch( () => setError( 'Could not update the description. Please try again.' ) )
			.then( () => setIsSaving( false ) );
	};

	const onKeyDown = e => {
		if ( isSaving ) {
			return;
		}

		if ( e.key === 'Escape' ) {
			onCancel();
		} else if ( e.key === 'Enter' && ! e.nativeEvent.isComposing ) {
			e.preventDefault();
			onSave();
		}
	};

	if ( isEditing ) {
		return (
			<form
				className="px-4 py-4 bg-hm-beige/50"
				onSubmit={ e => {
					e.preventDefault();
					onSave();
				} }
			>
				<textarea
					aria-label="Site description"
					autoFocus
					className="block w-full box-border m-0 px-2 py-1.5 border border-solid border-[#dfe1e5] rounded-md bg-white text-sm text-hm-dark-grey resize-y read-only:opacity-50"
					readOnly={ isSaving }
					rows={ 3 }
					value={ draft }
					onChange={ e => setDraft( e.target.value ) }
					onKeyDown={ onKeyDown }
				/>

				{ error && (
					<p className="m-0 mt-1.5 text-xs text-[#b42318]" role="alert">{ error }</p>
				) }

				<div className="flex justify-end gap-2 mt-2 [&>.btn]:m-0">
					<Button
						disabled={ isSaving }
						size="small"
						onClick={ onCancel }
					>
						Cancel
					</Button>
					<Button
						disabled={ isSaving }
						size="small"
						submit
						type="primary"
					>
						{ isSaving ? 'Saving…' : 'Save' }
					</Button>
				</div>
			</form>
		);
	}

	return (
		<div className="flex items-start justify-between gap-2 px-4 py-4 bg-hm-beige/50">
			<p className="text-sm opacity-60 m-0 min-w-0 break-words">{ site.description || 'No description yet.' }</p>
			{ site.user_can.edit && (
				<button
					ref={ editButton }
					aria-label="Edit site description"
					className="flex items-center justify-center shrink-0 size-6 -my-0.5 p-0 rounded-sm border-0 bg-transparent cursor-pointer opacity-60 hover:opacity-100 hover:bg-white/50 focus-visible:opacity-100 focus-visible:bg-white/50"
					title="Edit site description"
					type="button"
					onClick={ () => setDraft( site.description ) }
				>
					<PencilIcon />
				</button>
			) }
		</div>
	);
}
