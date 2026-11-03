import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import { withCurrentUser } from '../../hocs';

const getBrowserTimezone = () => {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
	} catch ( e ) {
		return null;
	}
};

const getTimezones = ( ...extra ) => {
	let zones = [];
	try {
		zones = Intl.supportedValuesOf( 'timeZone' );
	} catch ( e ) {
		// Older browsers can't list zones; fall back to the ones we know about.
	}

	return Array.from( new Set( [ ...zones, 'UTC', ...extra.filter( Boolean ) ] ) ).sort();
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

const BUTTON_CLASSES = [
	'w-full m-0 px-3 py-1.5 border border-[#dfe1e5] rounded-md bg-white text-sm font-medium text-hm-dark-grey cursor-pointer',
	'enabled:hover:bg-[#f5f6f8] disabled:opacity-50 disabled:cursor-not-allowed',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue',
].join( ' ' );

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

	const saved = ( currentUser && currentUser.meta && currentUser.meta.hm_time_timezone ) || '';
	const browser = getBrowserTimezone();
	const zones = useMemo( () => getTimezones( saved, browser ), [ saved, browser ] );

	if ( ! currentUser ) {
		return null;
	}

	const save = value => {
		setSaving( true );
		setError( null );
		Promise.resolve( onUpdateCurrentUser( { meta: { hm_time_timezone: value } } ) )
			.catch( () => setError( 'Could not update your timezone. Please try again.' ) )
			.then( () => setSaving( false ) );
	};

	const savedTime = saved ? formatTime( saved, now ) : null;

	return (
		<div className="TimezoneSetting text-sm">
			<div className="flex items-baseline justify-between gap-2 mb-1">
				<label
					className="text-xs font-medium text-gray-500"
					htmlFor="h2-timezone"
				>
					Timezone
				</label>
				{ isSaving ? (
					<span className="text-xs text-gray-500" role="status">Saving…</span>
				) : savedTime && (
					<span className="text-xs text-gray-500">{ savedTime }</span>
				) }
			</div>

			<select
				className="block w-full m-0 px-2 py-1.5 border border-[#dfe1e5] rounded-md bg-white text-sm text-hm-dark-grey disabled:opacity-50"
				disabled={ isSaving }
				id="h2-timezone"
				value={ saved }
				onChange={ e => save( e.target.value ) }
			>
				{ ! saved && <option value="">Not set</option> }
				{ zones.map( zone => (
					<option key={ zone } value={ zone }>{ formatName( zone ) }</option>
				) ) }
			</select>

			{ browser && browser !== saved && (
				<div className="mt-2">
					<p className="m-0 mb-1.5 text-xs text-gray-500">
						Your browser is set to { formatName( browser ) }.
					</p>
					<button
						className={ BUTTON_CLASSES }
						disabled={ isSaving }
						type="button"
						onClick={ () => save( browser ) }
					>
						Use browser timezone
					</button>
				</div>
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
