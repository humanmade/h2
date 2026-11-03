import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { withCurrentUser } from '../../hocs';

const getBrowserTimezone = () => {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
	} catch ( e ) {
		return null;
	}
};

const formatName = timeZone => timeZone.replace( /_/g, ' ' );

const formatTime = ( timeZone, date ) => {
	try {
		return new Intl.DateTimeFormat( undefined, {
			hour: 'numeric',
			minute: '2-digit',
			timeZone,
		} ).format( date );
	} catch ( e ) {
		return null;
	}
};

export function TimezoneSetting( props ) {
	const { currentUser, onUpdateCurrentUser } = props;
	const [ isSaving, setSaving ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ now, setNow ] = useState( () => new Date() );

	// Keep the displayed local time current while the menu is open.
	useEffect( () => {
		const timer = window.setInterval( () => setNow( new Date() ), 30 * 1000 );
		return () => window.clearInterval( timer );
	}, [] );

	if ( ! currentUser ) {
		return null;
	}

	const saved = ( currentUser.meta && currentUser.meta.hm_time_timezone ) || null;
	const browser = getBrowserTimezone();
	const savedTime = saved ? formatTime( saved, now ) : null;

	const onUseBrowser = () => {
		setSaving( true );
		setError( null );
		Promise.resolve( onUpdateCurrentUser( { meta: { hm_time_timezone: browser } } ) )
			.catch( () => setError( 'Could not update your timezone. Please try again.' ) )
			.then( () => setSaving( false ) );
	};

	return (
		<div className="TimezoneSetting text-sm">
			<p className="m-0 mb-1 text-xs font-medium text-gray-500">Timezone</p>
			{ saved ? (
				<p className="m-0 flex items-baseline justify-between gap-2">
					<span className="min-w-0 truncate text-hm-dark-grey">{ formatName( saved ) }</span>
					{ savedTime && <span className="shrink-0 text-xs text-gray-500">{ savedTime }</span> }
				</p>
			) : (
				<p className="m-0 text-gray-500">Not set</p>
			) }

			{ browser && browser !== saved && (
				<div className="mt-2">
					<p className="m-0 mb-1.5 text-xs text-gray-500">
						Your browser is set to { formatName( browser ) }.
					</p>
					<button
						className="w-full m-0 px-3 py-1.5 border border-[#dfe1e5] rounded-md bg-white text-sm font-medium text-hm-dark-grey cursor-pointer enabled:hover:bg-[#f5f6f8] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue"
						disabled={ isSaving }
						type="button"
						onClick={ onUseBrowser }
					>
						{ isSaving ? 'Saving…' : 'Use ' + formatName( browser ) }
					</button>
				</div>
			) }

			{ browser && browser === saved && (
				<p className="m-0 mt-1 text-xs text-gray-500">Matches your browser</p>
			) }

			{ error && (
				<p className="m-0 mt-1.5 text-xs text-[#b42318]" role="alert">{ error }</p>
			) }
		</div>
	);
}

TimezoneSetting.propTypes = {
	onUpdateCurrentUser: PropTypes.func.isRequired,
};

export default withCurrentUser( TimezoneSetting );
