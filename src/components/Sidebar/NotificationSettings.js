import React, { useEffect, useRef, useState } from 'react';

// Falcon stores preferences per-connector; H2 uses the WordPress connector.
const CONNECTOR = 'wordpress';

const MODES = [
	{
		id: 'none',
		label: 'None',
		description: 'Unsubscribe from all email notifications.',
		value: {
			post: '',
			comment: '',
		},
	},
	{
		id: 'posts',
		label: 'Just posts',
		description: 'Get an email for every new post.',
		value: {
			post: 'all',
			comment: '',
		},
	},
	{
		id: 'participant',
		label: 'Posts & my threads',
		description: 'New posts, plus comments on posts you’ve commented on.',
		value: {
			post: 'all',
			comment: 'participant',
		},
	},
	{
		id: 'all',
		label: 'All posts & comments',
		description: 'Get an email for every new post and comment.',
		value: {
			post: 'all',
			comment: 'all',
		},
	},
];

/**
 * Find the mode matching the user's current preferences.
 *
 * @param {object} prefs Falcon preferences for the connector.
 * @returns {string} Mode ID, or "custom".
 */
const getMode = prefs => {
	const mode = MODES.find( mode => (
		mode.value.post === prefs.post && mode.value.comment === prefs.comment
	) );
	if ( mode ) {
		return mode.id;
	}

	// Set to a combination we don't offer (e.g. via the profile screen).
	return 'custom';
};

const getModeLabel = mode => {
	if ( mode === 'custom' ) {
		return 'Custom';
	}

	return MODES.find( m => m.id === mode ).label;
};

/**
 * Make a request for the current user's preferences.
 *
 * @param {object|null} data Preferences to update, or null to fetch.
 * @returns {Promise<object>} Falcon preferences for the user.
 */
const request = ( data = null ) => {
	const url = new URL( `${ window.wpApiSettings.root }wp/v2/users/me`, window.location.href );
	url.searchParams.set( 'context', 'edit' );
	url.searchParams.set( '_fields', 'falcon_preferences' );

	const options = {
		credentials: 'same-origin',
		headers: {
			Accept: 'application/json',
			'X-WP-Nonce': window.wpApiSettings.nonce,
		},
	};
	if ( data ) {
		options.method = 'POST';
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify( {
			falcon_preferences: data,
		} );
	}

	return fetch( url, options )
		.then( response => response.json().then( body => {
			if ( ! response.ok ) {
				throw new Error( body.message || 'Could not load notification settings.' );
			}
			return body.falcon_preferences;
		} ) );
};

const BellIcon = ( { mode } ) => {
	const strokeProps = {
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 2,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
	};

	if ( mode === 'none' ) {
		return (
			<svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" { ...strokeProps }>
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
				<path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
				<path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
				<path d="M18 8a6 6 0 0 0-9.33-5" />
				<path d="M1 1l22 22" />
			</svg>
		);
	}

	return (
		<svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" { ...strokeProps }>
			<path
				d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
				fill={ mode === 'all' ? 'currentColor' : 'none' }
			/>
			<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			{ mode === 'participant' && (
				<circle cx="19" cy="5" r="3" fill="currentColor" stroke="none" />
			) }
		</svg>
	);
};

export default function NotificationSettings() {
	const [ prefs, setPrefs ] = useState( null );
	const [ error, setError ] = useState( null );
	const [ saving, setSaving ] = useState( false );
	const [ open, setOpen ] = useState( false );
	const container = useRef( null );

	useEffect( () => {
		let cancelled = false;
		request().then(
			data => ! cancelled && setPrefs( data[ CONNECTOR ] || null ),
			err => ! cancelled && setError( err.message )
		);
		return () => {
			cancelled = true;
		};
	}, [] );

	// Close when clicking outside, or pressing Escape.
	useEffect( () => {
		if ( ! open ) {
			return;
		}

		const onClick = e => {
			if ( container.current && ! container.current.contains( e.target ) ) {
				setOpen( false );
			}
		};
		const onKeyDown = e => {
			if ( e.key === 'Escape' ) {
				setOpen( false );
			}
		};
		document.addEventListener( 'mousedown', onClick );
		document.addEventListener( 'keydown', onKeyDown );
		return () => {
			document.removeEventListener( 'mousedown', onClick );
			document.removeEventListener( 'keydown', onKeyDown );
		};
	}, [ open ] );

	if ( ! prefs ) {
		// Still loading, or Falcon isn't exposing preferences for this site.
		return null;
	}

	const mode = getMode( prefs );
	const label = `Email notifications: ${ getModeLabel( mode ) }`;

	const onSelect = next => {
		const previous = prefs;
		setPrefs( {
			...prefs,
			...next.value,
		} );
		setError( null );
		setSaving( true );

		request( { [ CONNECTOR ]: next.value } ).then(
			data => {
				setSaving( false );
				setPrefs( data[ CONNECTOR ] || null );
			},
			err => {
				setSaving( false );
				setPrefs( previous );
				setError( err.message );
			}
		);
	};

	return (
		<div
			ref={ container }
			className="relative shrink-0"
		>
			<button
				aria-expanded={ open }
				aria-haspopup="true"
				aria-label={ label }
				className="flex items-center justify-center size-8 p-0 m-0 rounded-sm border-0 bg-transparent cursor-pointer hover:bg-white/50 focus-visible:bg-white/50"
				title={ label }
				type="button"
				onClick={ () => setOpen( ! open ) }
			>
				<BellIcon mode={ mode } />
			</button>

			{ open && (
				<div
					className="absolute right-0 top-full z-10 mt-2 w-72 bg-white border border-solid border-hm-beige rounded-sm shadow-lg text-sm"
					role="menu"
				>
					<p className="m-0 px-4 pt-3 pb-2 font-bold">
						Email notifications
					</p>
					<ul className="m-0 p-0 list-none divide-y divide-hm-beige/50 border-t border-solid border-hm-beige/50">
						{ MODES.map( option => (
							<li key={ option.id }>
								<button
									aria-checked={ mode === option.id }
									className="w-full grid grid-cols-[1.25rem_auto] gap-x-2 px-4 py-2 m-0 text-left bg-transparent border-0 cursor-pointer hover:bg-hm-beige/20 disabled:cursor-wait"
									disabled={ saving }
									role="menuitemradio"
									type="button"
									onClick={ () => onSelect( option ) }
								>
									<span aria-hidden="true">
										{ mode === option.id ? '✓' : '' }
									</span>
									<span>
										<span className="block font-bold">{ option.label }</span>
										<span className="block opacity-60 text-xs">{ option.description }</span>
									</span>
								</button>
							</li>
						) ) }
					</ul>
					{ error && (
						<p className="m-0 px-4 py-2 text-xs text-hm-red">
							{ error }
						</p>
					) }
				</div>
			) }
		</div>
	);
}
