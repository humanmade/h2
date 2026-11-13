import React, { useEffect, useRef, useState } from 'react';

import { withCurrentUser } from '../../hocs';
import Button from '../Button';
import PencilIcon from '../PencilIcon';

/**
 * Decode the description returned by the users endpoint.
 *
 * WordPress runs user descriptions through kses when saving, which escapes
 * characters like ampersands. It's safe to decode these as a textarea's content
 * is only ever treated as text, and the result is rendered as text by React.
 *
 * @param {string} text Escaped text.
 * @returns {string} Decoded text.
 */
const decodeDescription = text => {
	const textarea = document.createElement( 'textarea' );
	textarea.innerHTML = text;
	return textarea.value;
};

/**
 * Get the text to show for a user.
 *
 * The description is what the user edits here, and takes priority over the
 * long description from their facts, which they don't control from H2.
 *
 * @param {object} user User data.
 * @returns {string} Description text, or an empty string if there is none.
 */
const getDescription = user => {
	if ( user.description ) {
		return decodeDescription( user.description );
	}

	return ( user.facts && user.facts.long_description ) || '';
};

export function UserDescription( { currentUser, savingCurrentUser, user, onUpdateCurrentUser } ) {
	const isOwnProfile = !! currentUser && currentUser.id === user.id;
	const isSaving = !! savingCurrentUser;
	const description = getDescription( user );

	// The text being edited, or null when not editing.
	const [ draft, setDraft ] = useState( null );
	const [ error, setError ] = useState( null );
	const isEditing = draft !== null;

	// The textarea takes focus with it when it goes, so hand focus back.
	const editButton = useRef( null );
	const wasEditing = useRef( false );
	useEffect( () => {
		if ( wasEditing.current && ! isEditing && editButton.current ) {
			editButton.current.focus();
		}
		wasEditing.current = isEditing;
	}, [ isEditing ] );

	const onCancel = () => {
		setDraft( null );
		setError( null );
	};

	const onSave = () => {
		const value = draft.trim();
		if ( value === description ) {
			onCancel();
			return;
		}

		setError( null );
		Promise.resolve( onUpdateCurrentUser( { description: value } ) )
			.then( () => setDraft( null ) )
			.catch( () => setError( 'Could not update your description. Please try again.' ) );
	};

	const onKeyDown = e => {
		if ( isSaving ) {
			return;
		}

		// The description can have multiple paragraphs, so plain Enter is a new line.
		if ( e.key === 'Escape' ) {
			onCancel();
		} else if ( e.key === 'Enter' && ( e.metaKey || e.ctrlKey ) ) {
			e.preventDefault();
			onSave();
		}
	};

	if ( isEditing ) {
		return (
			<form
				className="mt-4"
				onSubmit={ e => {
					e.preventDefault();
					onSave();
				} }
			>
				<textarea
					aria-label="Your description"
					autoFocus
					className="block w-full box-border m-0 px-2 py-1.5 border border-solid border-[#dfe1e5] rounded-md bg-white text-sm leading-6 text-hm-dark-grey resize-y read-only:opacity-50"
					readOnly={ isSaving }
					rows={ 5 }
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

	if ( ! description && ! isOwnProfile ) {
		return null;
	}

	return (
		<div className="flex items-start justify-between gap-2 mt-4">
			<div className={ `min-w-0 text-sm leading-6 break-words ${ description ? 'text-gray-600' : 'text-gray-500' }` }>
				{ description ? (
					description.split( '\n' ).filter( text => text.trim() ).map( ( text, idx ) =>
						<p className="m-0 mb-3 last:mb-0" key={ idx }>{ text }</p>
					)
				) : (
					<p className="m-0">Add a description so people can learn more about you.</p>
				) }
			</div>

			{ isOwnProfile && (
				<button
					ref={ editButton }
					aria-label="Edit your description"
					className="flex items-center justify-center shrink-0 size-6 p-0 rounded-sm border-0 bg-transparent cursor-pointer opacity-60 hover:opacity-100 hover:bg-hm-beige/50 focus-visible:opacity-100 focus-visible:bg-hm-beige/50"
					title="Edit your description"
					type="button"
					onClick={ () => setDraft( description ) }
				>
					<PencilIcon />
				</button>
			) }
		</div>
	);
}

export default withCurrentUser( UserDescription );
