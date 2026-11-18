import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { withCurrentUser } from '../../hocs';

const VIEW_OPTIONS = [
	{
		value: 'compact',
		label: 'Excerpts with a "Continue" link',
	},
	{
		value: 'nocomments',
		label: 'Full posts, with comments hidden',
	},
	{
		value: 'full',
		label: 'Full posts, with comments shown',
	},
];

export function PostDisplaySetting( props ) {
	const { currentUser, savingCurrentUser, onUpdateCurrentUser } = props;
	// savingCurrentUser covers every user save, so track this setting's own save for the status.
	const [ isSavingDisplay, setIsSavingDisplay ] = useState( false );
	const [ error, setError ] = useState( null );

	if ( ! currentUser ) {
		return null;
	}

	const save = value => {
		setError( null );
		setIsSavingDisplay( true );
		Promise.resolve( onUpdateCurrentUser( { meta: { h2_view_preference: value } } ) )
			.catch( () => setError( 'Could not update your post display. Please try again.' ) )
			.finally( () => setIsSavingDisplay( false ) );
	};

	return (
		<div className="PostDisplaySetting text-sm">
			<div className="flex items-baseline justify-between gap-2 mb-1">
				<label
					className="text-xs font-medium text-gray-500"
					htmlFor="h2-post-display"
				>
					By default, posts show
				</label>
				{ isSavingDisplay && (
					<span className="text-xs text-gray-500" role="status">Saving…</span>
				) }
			</div>

			<select
				className="block w-full m-0 px-2 py-1.5 border border-[#dfe1e5] rounded-md bg-white text-sm text-hm-dark-grey disabled:opacity-50"
				disabled={ !! savingCurrentUser }
				id="h2-post-display"
				value={ currentUser.meta?.h2_view_preference || 'full' }
				onChange={ e => save( e.target.value ) }
			>
				{ VIEW_OPTIONS.map( ( { value, label } ) => (
					<option key={ value } value={ value }>{ label }</option>
				) ) }
			</select>

			{ error && (
				<p className="m-0 mt-1.5 text-xs text-[#b42318]" role="alert">{ error }</p>
			) }
		</div>
	);
}

PostDisplaySetting.propTypes = {
	savingCurrentUser: PropTypes.bool,
	onUpdateCurrentUser: PropTypes.func.isRequired,
};

export default withCurrentUser( PostDisplaySetting );
